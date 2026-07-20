import { CheckCircle, Heart } from "lucide-react";
import type { ServiceInfo, ClientDetails } from "@/pages/Book";

const BookingConfirmation = ({
  service,
  clientDetails,
}: {
  service: ServiceInfo;
  clientDetails: ClientDetails;
}) => (
  <div className="mx-auto max-w-lg px-1 text-center">
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-10">
      <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
      <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
        You're All Set!
      </h2>
      <p className="mb-8 text-sm leading-relaxed text-muted-foreground font-body sm:text-base">
        We can't wait to meet your family. A confirmation has been sent to your
        email.
      </p>

      <div className="mb-8 rounded-xl border border-border bg-background p-5 text-left">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground font-body">
          Booking Summary
        </h3>
        <div className="space-y-2 text-sm font-body">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold text-foreground">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-semibold text-primary">{service.priceLabel}</span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">Client</span>
            <span className="font-semibold text-foreground">
              {clientDetails.firstName} {clientDetails.lastName}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="break-all font-semibold text-foreground">{clientDetails.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-body">
        <Heart className="h-4 w-4 text-primary" />
        <span>Thank you for choosing SonoView For You</span>
      </div>
    </div>
  </div>
);

export default BookingConfirmation;
