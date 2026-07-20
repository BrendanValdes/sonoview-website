import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Phone } from "lucide-react";

const SERVICES = [
  "Signature Bonding Experience – $179",
  "Early Pregnancy Ultrasound – $129",
  "Heartbeat Reassurance Ultrasound – $89",
  "3D/4D Fetal Imaging – $199",
  "Comprehensive Anatomy Ultrasound – $279",
  "OB Second Trimester Anatomy Ultrasound – $249",
  "OB Third Trimester Ultrasound – $199",
  "Stroke Risk / Carotid Artery Ultrasound – $195",
  "AAA Aneurysm Screening – $179",
  "Thyroid Scan (Neck Ultrasound) – $165",
  "Advanced Breast Ultrasound (Both) – $249",
  "Focused Breast Ultrasound (One) – $165",
  "Comprehensive Abdominal Ultrasound – $249",
  "Venous Doppler Ultrasound (Single Limb) – $189",
  "Bilateral Arterial Doppler Ultrasound – $229",
  "Hernia Ultrasound – $175",
  "Testicular Ultrasound – $175",
  "Soft Tissue Ultrasound – $150",
  "Pelvic Ultrasound – $179",
  "Comprehensive Pelvic Ultrasound – $219",
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
  consent: boolean;
}

const MultiStepForm = ({ id }: { id?: string }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
    consent: false,
  });

  const update = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext1 = form.name.trim() && form.phone.trim() && form.email.trim();
  const canNext2 = form.service && form.date && form.time;
  const canSubmit = form.consent;

  const handleSubmit = () => {
    // In production, this would POST to a backend
    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...form,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
    };
    console.log("Form submission:", payload);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div id={id} className="rounded-xl border border-border bg-card p-8 text-center shadow-lg">
        <CheckCircle className="mx-auto mb-4 h-14 w-14 text-primary" />
        <h3 className="mb-2 text-2xl font-bold text-foreground">Thank You!</h3>
        <p className="mb-4 text-muted-foreground">
          Your appointment request has been received. We'll contact you shortly to confirm.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          For fastest scheduling, call us directly:
        </p>
        <a href="tel:+17753057868" onClick={() => { (window as any).gtag_report_conversion?.("tel:+17753057868"); }}>
          <Button variant="cta" size="lg" className="w-full sm:w-auto">
            <Phone className="mr-2 h-4 w-4" /> (775) 305-7868
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div id={id} className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                s <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s < step ? "bg-primary" : "bg-secondary"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">Step {step} of 3</p>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(775) 000-0000"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            variant="cta"
            size="lg"
            className="w-full"
            disabled={!canNext1}
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>Select Service</Label>
            <Select value={form.service} onValueChange={(v) => update("service", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a service..." />
              </SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Preferred Date</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Preferred Time</Label>
            <Select value={form.time} onValueChange={(v) => update("time", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a time..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="flex-1"
              disabled={!canNext2}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Additional Notes (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Any details you'd like us to know..."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={form.consent}
              onCheckedChange={(c) => update("consent", c === true)}
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="text-sm leading-snug text-muted-foreground">
              I consent to being contacted about my appointment request. My information will be kept
              private and secure.
            </Label>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button
              variant="cta"
              size="lg"
              className="flex-1"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Submit Request
            </Button>
          </div>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Takes less than 60 seconds.
      </p>
    </div>
  );
};

export default MultiStepForm;
