import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import StickyHeader from "@/components/landing/StickyHeader";
import Footer from "@/components/landing/Footer";
import BookingServiceSelect from "@/components/booking/BookingServiceSelect";
import BookingClientDetails from "@/components/booking/BookingClientDetails";
import BookingPayment from "@/components/booking/BookingPayment";
import BookingSchedule from "@/components/booking/BookingSchedule";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import BookingProgress from "@/components/booking/BookingProgress";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import { getStripe } from "@/lib/stripeLoader";
import { preconnect } from "@/lib/preconnect";
import {
  trackBeginCheckout,
  trackFormStart,
  trackAddPaymentInfo,
  trackSchedule,
  trackPurchase,
} from "@/hooks/useAnalytics";

export interface ServiceInfo {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  calUrl: string;
}

export const BOOKING_SERVICES: ServiceInfo[] = [
  {
    id: "bonding",
    name: "Signature 3D/4D Bonding Experience",
    price: 229,
    priceLabel: "$229",
    calUrl: "https://api.leadconnectorhq.com/widget/booking/b4QNtnb92RWB7pwIcTOv",
  },
  {
    id: "gender-reveal",
    name: "Gender Reveal Experience",
    price: 199,
    priceLabel: "$199",
    calUrl: "https://api.leadconnectorhq.com/widget/booking/ok0nm6l9eQnFxRRCaD8y",
  },
  {
    id: "early-pregnancy",
    name: "Early Pregnancy Ultrasound",
    price: 129,
    priceLabel: "$129",
    calUrl: "https://api.leadconnectorhq.com/widget/booking/vFgu5oBNOMwUB93TAICz",
  },
];

export interface ClientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  weeksPregnant: string;
}

const PAYMENT_SESSION_TTL_MS = 30 * 60 * 1000;

type PaymentSession = {
  serviceId?: string;
  createdAt?: number;
  transactionId?: string;
};

const createTransactionId = (serviceId: string, createdAt = Date.now()) =>
  `booking_${serviceId}_${createdAt}`;

const readPaymentSession = (key: string, serviceId?: string | null) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const session = JSON.parse(raw) as PaymentSession;
    const isFresh = typeof session.createdAt === "number" && Date.now() - session.createdAt < PAYMENT_SESSION_TTL_MS;
    const serviceMatches = !serviceId || session.serviceId === serviceId;
    return isFresh && serviceMatches ? session : null;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

const Book = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const preselected = searchParams.get("service");
  const redirectStatus = searchParams.get("redirect_status");

  const [step, setStep] = useState(0); // 0=select, 1=details, 2=payment, 3=schedule, 4=confirm
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    const storedServiceId = sessionStorage.getItem("booking:selectedServiceId");
    const storedClientDetails = sessionStorage.getItem("booking:clientDetails");
    const serviceId = preselected || storedServiceId;

    if (serviceId && !selectedService) {
      const storedService = BOOKING_SERVICES.find((s) => s.id === serviceId);
      if (storedService) setSelectedService(storedService);
    }

    if (storedClientDetails && !clientDetails) {
      try {
        setClientDetails(JSON.parse(storedClientDetails));
      } catch {
        sessionStorage.removeItem("booking:clientDetails");
      }
    }

    if (pathname === "/schedule") {
      const completedSession = readPaymentSession("booking:paidPaymentSession", serviceId);
      const pendingSession = readPaymentSession("booking:pendingPaymentSession", serviceId);

      if (!completedSession && redirectStatus === "succeeded" && pendingSession) {
        const paidSession: PaymentSession = {
          ...pendingSession,
          transactionId:
            pendingSession.transactionId ||
            createTransactionId(pendingSession.serviceId || serviceId || "unknown", pendingSession.createdAt),
        };
        sessionStorage.setItem("booking:paidPaymentSession", JSON.stringify(paidSession));
        sessionStorage.removeItem("booking:pendingPaymentSession");
      } else if (!completedSession) {
        setPaymentComplete(false);
        setStep(0);
        navigate("/book", { replace: true });
        return;
      }

      setPaymentComplete(true);
      setStep(3);
    }
  }, [pathname, preselected, selectedService, clientDetails, redirectStatus, navigate]);

  useEffect(() => {
    if (preselected) {
      const found = BOOKING_SERVICES.find((s) => s.id === preselected);
      if (found) {
        setSelectedService(found);
        sessionStorage.setItem("booking:selectedServiceId", found.id);
        if (pathname !== "/schedule") {
          setStep(1);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [preselected, pathname]);

  // Fire the correct standard GA4 event each time a booking step loads
  // Note: begin_checkout fires only on actual service selection (in handleSelectService), not on landing
  useEffect(() => {
    if (step === 1 && selectedService) {
      // Warm Stripe SDK + API origins now so payment step renders instantly.
      getStripe();
      preconnect([
        "https://js.stripe.com",
        "https://api.stripe.com",
        "https://m.stripe.network",
      ]);
      trackFormStart({
        form_id: "booking_client_details",
        item_id: selectedService.id,
        item_name: selectedService.name,
      });
    } else if (step === 2 && selectedService) {
      // Warm GHL origin so the scheduler iframe loads instantly on step 3.
      preconnect([
        "https://api.leadconnectorhq.com",
      ]);
      trackAddPaymentInfo({
        value: selectedService.price,
        items: [
          {
            item_id: selectedService.id,
            item_name: selectedService.name,
            price: selectedService.price,
            quantity: 1,
          },
        ],
      });
    } else if (step === 3 && selectedService) {
      trackSchedule({
        item_id: selectedService.id,
        item_name: selectedService.name,
        value: selectedService.price,
        currency: "USD",
      });
    }
  }, [step, selectedService]);

  useEffect(() => {
    if (pathname !== "/schedule" || !paymentComplete || !selectedService) return;

    // Wait for clientDetails to be restored from sessionStorage before firing
    // the GHL webhook — otherwise we send blank contact info and never retry.
    if (!clientDetails?.email) return;

    const paidSession = readPaymentSession("booking:paidPaymentSession", selectedService.id);
    if (!paidSession) return;

    const transactionId =
      paidSession.transactionId ||
      createTransactionId(selectedService.id, paidSession.createdAt);
    const trackedKey = `booking:purchaseTracked:${transactionId}`;
    if (sessionStorage.getItem(trackedKey)) return;

    trackPurchase({
      value: selectedService.price,
      currency: "USD",
      transaction_id: transactionId,
      items: [
        {
          item_name: selectedService.name,
          price: selectedService.price,
          quantity: 1,
        },
      ],
    });

    const paymentWebhookPayload = {
      event: "payment_completed",
      firstName: String(clientDetails?.firstName ?? ""),
      lastName: String(clientDetails?.lastName ?? ""),
      email: String(clientDetails?.email ?? ""),
      phone: String(clientDetails?.phone ?? ""),
      weeksPregnant: String(clientDetails?.weeksPregnant ?? ""),
      packageBooked: String(selectedService?.name ?? ""),
    };
    console.log("[GHL Webhook] payment_completed →", paymentWebhookPayload);
    fetch("https://services.leadconnectorhq.com/hooks/7FgEn9JF26NTSFr42uo3/webhook-trigger/c1750636-893a-4572-86d0-a1f065de0599", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentWebhookPayload),
      keepalive: true,
    }).catch((err) => console.error("[Booking] Payment webhook failed:", err));

    sessionStorage.setItem(trackedKey, "true");
  }, [pathname, paymentComplete, selectedService, clientDetails]);

  const handleSelectService = (service: ServiceInfo) => {
    trackBeginCheckout({
      value: service.price,
      currency: "USD",
      items: [
        {
          item_id: service.id,
          item_name: service.name,
          price: service.price,
          quantity: 1,
        },
      ],
    });
    setSelectedService(service);
    sessionStorage.setItem("booking:selectedServiceId", service.id);
    setSearchParams({ service: service.id }, { replace: true });
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClientSubmit = (details: ClientDetails) => {
    setClientDetails(details);
    sessionStorage.setItem("booking:clientDetails", JSON.stringify(details));

    // Fire-and-forget webhook to LeadConnector with contact data
    try {
      const contactWebhookPayload = {
        firstName: String(details.firstName ?? ""),
        lastName: String(details.lastName ?? ""),
        phone: String(details.phone ?? ""),
        email: String(details.email ?? ""),
        weeksPregnant: String(details.weeksPregnant ?? ""),
        packageBooked: String(selectedService?.name ?? ""),
      };
      console.log("[GHL Webhook] contact_submitted →", contactWebhookPayload);
      fetch(
        "https://services.leadconnectorhq.com/hooks/7FgEn9JF26NTSFr42uo3/webhook-trigger/bdHEPb45rYTHd07mj2E4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(contactWebhookPayload),
          keepalive: true,
        }
      ).catch((err) => console.error("[Booking] Webhook failed:", err));
    } catch (err) {
      console.error("[Booking] Webhook error:", err);
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSuccess = () => {
    if (selectedService) {
      const createdAt = Date.now();
      sessionStorage.setItem(
        "booking:paidPaymentSession",
        JSON.stringify({
          serviceId: selectedService.id,
          createdAt,
          transactionId: createTransactionId(selectedService.id, createdAt),
        })
      );
      sessionStorage.removeItem("booking:pendingPaymentSession");
    }
    setPaymentComplete(true);
    setStep(3);
    if (selectedService) sessionStorage.setItem("booking:selectedServiceId", selectedService.id);
    if (clientDetails) sessionStorage.setItem("booking:clientDetails", JSON.stringify(clientDetails));
    navigate(
      selectedService ? `/schedule?service=${selectedService.id}` : "/schedule",
      { replace: true }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleScheduleComplete = async () => {
    console.log("[Booking] handleScheduleComplete called");
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Note: GA4 purchase event is fired when step 3 (/schedule) loads, right after payment.

    // Send booking notification email
    if (selectedService && clientDetails) {
      const payload = {
        customerName: `${clientDetails.firstName} ${clientDetails.lastName}`,
        email: clientDetails.email,
        phone: clientDetails.phone,
        weeksPregnant: clientDetails.weeksPregnant,
        serviceName: selectedService.name,
        amountPaid: selectedService.priceLabel,
      };
      console.log("[Booking] Sending notification with payload:", payload);
      try {
        const { data, error } = await supabase.functions.invoke("send-booking-notification", {
          body: payload,
        });
        console.log("[Booking] Notification response:", { data, error });
        if (error) {
          console.error("[Booking] Notification error:", error);
        }
      } catch (err) {
        console.error("[Booking] Failed to send booking notification:", err);
      }
    } else {
      console.warn("[Booking] Missing selectedService or clientDetails, skipping notification");
    }
  };

  const activeStep = step === 0 ? 0 : step;

  return (
    <>
      {pathname === "/schedule" ? (
        <SEO
          title="Schedule Your Session | SonoView For You"
          description="Pick your appointment time for your SonoView ultrasound session in Reno NV."
        />
      ) : (
        <SEO
          title="Book Your Pregnancy Ultrasound | SonoView For You"
          description="Book your 3D/4D ultrasound in Reno NV. Early pregnancy, gender reveal, and bonding sessions available. Same week appointments. Se habla español."
        />
      )}
      <StickyHeader />
      <main className="min-h-screen bg-background">
        <section className="py-12 sm:py-32">
          <div className="container mx-auto px-5 sm:px-4">
            <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-16">
              <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-4xl md:text-5xl">
                {step === 0
                  ? "Choose Your Experience"
                  : step === 4
                  ? "You're All Set!"
                  : "Book Your Experience"}
              </h1>
              {step === 0 && (
                <p className="text-sm text-muted-foreground font-body sm:text-base">
                  Select the experience that feels right for you — we can't wait
                  to meet your family.
                </p>
              )}
            </div>

            {step === 0 && (
              <BookingServiceSelect
                services={BOOKING_SERVICES}
                onSelect={handleSelectService}
              />
            )}

            {step === 1 && selectedService && (
              <div className="mx-auto px-1" style={{ maxWidth: '600px' }}>
                <BookingProgress currentStep={step} />
                <BookingClientDetails
                  service={selectedService}
                  onSubmit={handleClientSubmit}
                  onBack={() => setStep(0)}
                />
              </div>
            )}

            {step === 2 && selectedService && clientDetails && (
              <div className="mx-auto px-1" style={{ maxWidth: '600px' }}>
                <BookingProgress currentStep={step} />
                <BookingPayment
                  service={selectedService}
                  clientDetails={clientDetails}
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setStep(1)}
                />
              </div>
            )}

            {step === 3 && selectedService && (
              <div className="mx-auto max-w-3xl">
                <BookingProgress currentStep={step} />
                <BookingSchedule
                  service={selectedService}
                  onComplete={handleScheduleComplete}
                  customerName={clientDetails ? `${clientDetails.firstName} ${clientDetails.lastName}` : undefined}
                  customerEmail={clientDetails?.email}
                />
              </div>
            )}

            {step === 3 && !selectedService && pathname === "/schedule" && (
              <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 text-center shadow-lg sm:p-8">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                  We’re reopening your scheduler
                </h2>
                <p className="mt-3 text-sm text-muted-foreground font-body sm:text-base">
                  We couldn’t recover the appointment details from this link. Return to booking and we’ll get you back to scheduling right away.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button variant="cta" size="lg" className="font-body" onClick={() => navigate("/book")}> 
                    Return to booking
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && selectedService && clientDetails && (
              <BookingConfirmation
                service={selectedService}
                clientDetails={clientDetails}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Book;
