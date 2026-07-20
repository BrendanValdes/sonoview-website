import { useEffect, useMemo, useRef, useState } from "react";
import type { ServiceInfo } from "@/pages/Book";
import { Button } from "@/components/ui/button";

interface BookingScheduleProps {
  service: ServiceInfo;
  onComplete: () => void;
  customerName?: string;
  customerEmail?: string;
}

const BookingSchedule = ({
  service,
  onComplete,
  customerName,
  customerEmail,
}: BookingScheduleProps) => {
  const fallbackTimeoutRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const scheduleUrl = useMemo(() => {
    const url = new URL(service.calUrl);
    if (customerName) {
      const [first, ...rest] = customerName.split(" ");
      url.searchParams.set("first_name", first);
      if (rest.length) url.searchParams.set("last_name", rest.join(" "));
      url.searchParams.set("name", customerName);
    }
    if (customerEmail) url.searchParams.set("email", customerEmail);
    return url.toString();
  }, [customerEmail, customerName, service.calUrl]);

  useEffect(() => {
    setIsLoading(true);
    setShowFallback(false);

    fallbackTimeoutRef.current = window.setTimeout(() => {
      setShowFallback(true);
    }, 20000);

    const handleMessage = (e: MessageEvent) => {
      if (
        typeof e.origin === "string" &&
        !e.origin.includes("leadconnectorhq.com") &&
        !e.origin.includes("gohighlevel.com")
      )
        return;
      const data = e.data;
      const type = typeof data === "string" ? data : data?.type || data?.event;
      if (
        typeof type === "string" &&
        /book(ing)?[-_ ]?(success|complete|confirmed|created)|appointment[-_ ]?(booked|confirmed|created)/i.test(type)
      ) {
        onComplete();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (fallbackTimeoutRef.current) {
        window.clearTimeout(fallbackTimeoutRef.current);
        fallbackTimeoutRef.current = null;
      }
    };
  }, [scheduleUrl, reloadKey, onComplete]);

  const handleIframeLoad = () => {
    if (fallbackTimeoutRef.current) {
      window.clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
    setIsLoading(false);
    setShowFallback(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary font-body">
          ✓ Payment Confirmed
        </div>
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          Schedule Your Appointment
        </h2>
        <p className="text-sm text-muted-foreground font-body">
          Pick a date and time that works best for you.
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        style={{ minHeight: "600px" }}
      >
        <iframe
          key={`${scheduleUrl}-${reloadKey}`}
          src={scheduleUrl}
          title="Schedule your appointment"
          onLoad={handleIframeLoad}
          className={`${isLoading || showFallback ? "opacity-0" : "opacity-100"} h-[600px] w-full transition-opacity sm:h-[800px]`}
          style={{ minHeight: "600px", border: 0 }}
          scrolling="yes"
          allow="payment"
        />

        {isLoading && !showFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card px-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-body">
              Loading live appointment times…
            </p>
          </div>
        )}

        {showFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card px-6 py-10 text-center sm:px-10">
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                Scheduler taking longer than expected
              </h3>
              <p className="mt-2 text-sm text-muted-foreground font-body sm:text-base">
                Your payment went through. If the embedded calendar doesn’t appear, open the scheduler directly in a new tab and finish choosing your appointment time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="cta" size="lg" className="font-body" asChild>
                <a href={scheduleUrl} target="_blank" rel="noreferrer">
                  Open scheduler
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-body"
                onClick={() => {
                  setIsLoading(true);
                  setShowFallback(false);
                  setReloadKey((key) => key + 1);
                }}
              >
                Retry embed
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground font-body">
        After scheduling, you'll receive a confirmation email with all the details.
      </p>

      <div className="mt-6 text-center">
        <button
          onClick={onComplete}
          className="text-sm text-primary underline underline-offset-4 font-body hover:text-primary/80"
        >
          I've scheduled my appointment — continue →
        </button>
      </div>
    </div>
  );
};

export default BookingSchedule;
