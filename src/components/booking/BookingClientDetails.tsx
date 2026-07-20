import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import type { ServiceInfo, ClientDetails } from "@/pages/Book";

const stripPhoneFormatting = (phone: string) => phone.replace(/[\s\-\.\(\)\+]/g, "");

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

const isValidPhone = (phone: string) => {
  const digits = stripPhoneFormatting(phone);
  // Allow optional leading "1" for country code
  return /^1?\d{10}$/.test(digits);
};

const getPhoneError = (phone: string) => {
  if (!phone.trim()) return null;
  const digits = stripPhoneFormatting(phone).replace(/^1(?=\d{10}$)/, "");
  if (digits.length < 10) return `Enter a 10-digit phone number (${digits.length}/10 digits entered)`;
  if (digits.length > 10) return "Phone number must be exactly 10 digits";
  return null;
};

const getEmailError = (email: string) => {
  if (!email.trim()) return null;
  if (!isValidEmail(email)) return "Enter a valid email address (e.g. you@email.com)";
  return null;
};

const BookingClientDetails = ({
  service,
  onSubmit,
  onBack,
}: {
  service: ServiceInfo;
  onSubmit: (d: ClientDetails) => void;
  onBack: () => void;
}) => {
  const [form, setForm] = useState<ClientDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    weeksPregnant: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (field: keyof ClientDetails, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const emailError = getEmailError(form.email);
  const phoneError = getPhoneError(form.phone);

  const isValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.weeksPregnant.trim() &&
    !emailError &&
    !phoneError;

  return (
    <div>
      <div className="mb-6 rounded-xl border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground font-body">Selected:</p>
        <p className="font-bold text-foreground">{service.name}</p>
        <p className="text-lg font-bold text-primary">{service.priceLabel}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-xl font-bold text-foreground sm:text-2xl">
          Your Details
        </h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName" className="font-body">First Name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="font-body">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Smith"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="font-body">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => touch("email")}
              className="mt-1"
            />
            {touched.email && emailError && (
              <p className="text-sm text-destructive mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="font-body">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(775) 000-0000"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              onBlur={() => touch("phone")}
              className="mt-1"
            />
            {touched.phone && phoneError && (
              <p className="text-sm text-destructive mt-1">{phoneError}</p>
            )}
          </div>
          <div>
            <Label htmlFor="weeks" className="font-body">Weeks Pregnant</Label>
            <Input
              id="weeks"
              type="number"
              placeholder="e.g. 28"
              min={1}
              max={42}
              value={form.weeksPregnant}
              onChange={(e) => update("weeksPregnant", e.target.value)}
              className="mt-1"
            />
          </div>
          <p className="text-sm italic text-muted-foreground font-body pt-2">
            Please arrive with a full bladder for best imaging results.
          </p>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-body"
            onClick={onBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            variant="cta"
            size="lg"
            className="w-full sm:flex-1 font-body"
            disabled={!isValid}
            onClick={() => onSubmit(form)}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingClientDetails;
