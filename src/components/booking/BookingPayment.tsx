import { useState, useEffect } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStripe } from "@/lib/stripeLoader";
import type { ServiceInfo, ClientDetails } from "@/pages/Book";

const stripePromise = getStripe();

type DiscountInfo = {
  id: string;
  percentOff: number | null;
  amountOff: number | null;
};

const formatUsd = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const PaymentForm = ({
  service,
  payAmountCents,
  appliedDiscount,
  couponCode,
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  applyingCoupon,
  couponError,
  onSuccess,
  onBack,
}: {
  service: ServiceInfo;
  payAmountCents: number;
  appliedDiscount: DiscountInfo | null;
  couponCode: string;
  setCouponCode: (v: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  applyingCoupon: boolean;
  couponError: string | null;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      sessionStorage.setItem(
        "booking:pendingPaymentSession",
        JSON.stringify({ serviceId: service.id, createdAt: Date.now() })
      );

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/schedule?service=${service.id}`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        sessionStorage.removeItem("booking:pendingPaymentSession");
        setError(confirmError.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const payLabel = formatUsd(payAmountCents);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 rounded-xl border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground font-body">Paying for:</p>
        <p className="font-bold text-foreground">{service.name}</p>
        {appliedDiscount ? (
          <div className="mt-1">
            <p className="text-base text-muted-foreground font-body line-through">
              {service.priceLabel}
            </p>
            <p className="text-2xl font-bold text-emerald-600">{payLabel}</p>
          </div>
        ) : (
          <p className="text-2xl font-bold text-primary">{service.priceLabel}</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          Payment Details
        </h2>
        <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground font-body">
          <Lock className="h-3.5 w-3.5" /> Secure payment powered by Stripe
        </p>

        <PaymentElement />

        {error && (
          <p className="mt-3 text-sm text-destructive font-body">{error}</p>
        )}

        {/* Referral / coupon code */}
        <div className="mt-6 border-t border-border pt-6">
          <label
            htmlFor="referral-code"
            className="mb-2 block text-sm font-medium text-foreground font-body"
          >
            Have a referral code? Enter it here
          </label>
          <div className="flex gap-2">
            <Input
              id="referral-code"
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className={`font-body ${
                appliedDiscount ? "border-emerald-500 focus-visible:ring-emerald-500" : ""
              }`}
              disabled={applyingCoupon || processing || !!appliedDiscount}
              autoComplete="off"
            />
            {appliedDiscount ? (
              <Button
                type="button"
                variant="outline"
                onClick={onRemoveCoupon}
                disabled={applyingCoupon || processing}
                className="font-body"
              >
                Remove
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onApplyCoupon}
                disabled={!couponCode.trim() || applyingCoupon || processing}
                className="font-body"
              >
                {applyingCoupon ? "Checking…" : "Apply"}
              </Button>
            )}
          </div>
          {appliedDiscount && appliedDiscount.percentOff ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-600 font-body">
              <Check className="h-4 w-4" />
              {appliedDiscount.percentOff}% discount applied!
            </p>
          ) : null}
          {couponError && (
            <p className="mt-2 text-sm text-destructive font-body">
              {couponError}
            </p>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="font-body"
            onClick={onBack}
            disabled={processing}
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            variant="cta"
            size="lg"
            className="flex-1 font-body"
            disabled={!stripe || processing || applyingCoupon}
          >
            {processing ? "Processing…" : `Pay ${payLabel}`}
          </Button>
        </div>

      </div>
    </form>
  );
};

const BookingPaymentWrapper = ({
  service,
  clientDetails,
  onSuccess,
  onBack,
}: {
  service: ServiceInfo;
  clientDetails: ClientDetails;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [payAmountCents, setPayAmountCents] = useState<number>(
    service.price * 100
  );
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const fetchIntent = async (code?: string) => {
    const { data, error } = await supabase.functions.invoke(
      "create-payment-intent",
      {
        body: {
          amount: service.price * 100,
          currency: "usd",
          metadata: {
            service: service.name,
            email: clientDetails.email,
            name: `${clientDetails.firstName} ${clientDetails.lastName}`,
          },
          ...(code ? { couponCode: code } : {}),
        },
      }
    );
    return { data, error };
  };

  useEffect(() => {
    const createIntent = async () => {
      try {
        const { data, error } = await fetchIntent();
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
        setPayAmountCents(data.amount ?? service.price * 100);
      } catch (err: any) {
        console.error("Failed to create payment intent:", err);
        setError(err.message || "Could not initialize payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    createIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, clientDetails]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const { data, error } = await fetchIntent(code);
      // Edge function returns 400 with { error: "invalid_coupon" } via FunctionsHttpError.
      const errMessage =
        (error as any)?.context?.body
          ? await tryParseError((error as any).context)
          : data?.error;
      if (errMessage === "invalid_coupon" || (error && !data?.clientSecret)) {
        setCouponError(
          "That code doesn't look right — double check and try again."
        );
        return;
      }
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      setPayAmountCents(data.amount);
      setAppliedDiscount(data.discountApplied ?? null);
    } catch (err: any) {
      console.error("Coupon apply failed:", err);
      setCouponError(
        "That code doesn't look right — double check and try again."
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const { data, error } = await fetchIntent();
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
      setPayAmountCents(data.amount ?? service.price * 100);
      setAppliedDiscount(null);
      setCouponCode("");
    } catch (err: any) {
      console.error("Failed to remove coupon:", err);
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground font-body">
          Preparing secure payment…
        </p>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="text-center py-16">
        <p className="mb-4 text-sm text-destructive font-body">
          {error || "Could not initialize payment."}
        </p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <Elements
      // Re-mount Elements when clientSecret changes (e.g., after coupon apply)
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            fontFamily: "'DM Sans', sans-serif",
            colorPrimary: "#7C5CBF",
          },
        },
      }}
    >
      <PaymentForm
        service={service}
        payAmountCents={payAmountCents}
        appliedDiscount={appliedDiscount}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        applyingCoupon={applyingCoupon}
        couponError={couponError}
        onSuccess={() => {
          if (appliedDiscount) {
            try {
              const referralWebhookPayload = {
                firstName: String(clientDetails.firstName ?? ""),
                lastName: String(clientDetails.lastName ?? ""),
                phone: String(clientDetails.phone ?? ""),
                email: String(clientDetails.email ?? ""),
                packageBooked: String(service.name ?? ""),
                referral_code: "FRIEND20",
              };
              console.log("[GHL Webhook] referral_used →", referralWebhookPayload);
              fetch(
                "https://services.leadconnectorhq.com/hooks/7FgEn9JF26NTSFr42uo3/webhook-trigger/4cb8a2d0-3c46-4305-af51-d5027237fd56",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(referralWebhookPayload),
                  keepalive: true,
                }
              ).catch((err) =>
                console.error("[Booking] Referral webhook failed:", err)
              );
            } catch (err) {
              console.error("[Booking] Referral webhook error:", err);
            }
          }
          onSuccess();
        }}
        onBack={onBack}
      />
    </Elements>
  );
};

// Best-effort parse of supabase functions error body to detect "invalid_coupon".
async function tryParseError(context: any): Promise<string | null> {
  try {
    if (typeof context?.json === "function") {
      const body = await context.json();
      return body?.error ?? null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default BookingPaymentWrapper;
