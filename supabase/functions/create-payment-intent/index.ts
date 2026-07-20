const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const stripeGet = async (path: string, key: string) =>
  fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

const stripePost = async (path: string, key: string, body: URLSearchParams) =>
  fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

// Resolve a user-entered code to a Stripe coupon id.
// Accepts either a direct coupon id or a promotion code (case-insensitive).
const resolveCoupon = async (code: string, key: string) => {
  const trimmed = code.trim();
  if (!trimmed) return null;

  // Try promotion code first (what customers usually receive).
  const promoRes = await stripeGet(
    `promotion_codes?code=${encodeURIComponent(trimmed)}&active=true&limit=1`,
    key
  );
  if (promoRes.ok) {
    const promoData = await promoRes.json();
    const promo = promoData?.data?.[0];
    if (promo?.coupon?.valid) return promo.coupon;
  }

  // Fallback: treat as raw coupon id.
  const couponRes = await stripeGet(
    `coupons/${encodeURIComponent(trimmed)}`,
    key
  );
  if (couponRes.ok) {
    const coupon = await couponRes.json();
    if (coupon?.valid) return coupon;
  }

  return null;
};

const applyCoupon = (
  amount: number,
  coupon: { percent_off?: number | null; amount_off?: number | null }
) => {
  let discounted = amount;
  if (coupon.percent_off) {
    discounted = Math.round(amount * (1 - coupon.percent_off / 100));
  } else if (coupon.amount_off) {
    discounted = amount - coupon.amount_off;
  }
  return Math.max(discounted, 0);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      return jsonResponse({ error: "Stripe secret key not configured" }, 500);
    }

    const { amount, currency, metadata, couponCode } = await req.json();

    if (!amount || typeof amount !== "number" || amount < 50) {
      return jsonResponse({ error: "Invalid amount" }, 400);
    }

    let finalAmount = amount;
    let appliedCoupon: any = null;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      appliedCoupon = await resolveCoupon(couponCode, STRIPE_SECRET_KEY);
      if (!appliedCoupon) {
        return jsonResponse({ error: "invalid_coupon" }, 400);
      }
      finalAmount = applyCoupon(amount, appliedCoupon);
      // Stripe requires PaymentIntents to be at least 50 cents.
      if (finalAmount < 50) finalAmount = 50;
    }

    const params = new URLSearchParams({
      amount: String(finalAmount),
      currency: currency || "usd",
      "automatic_payment_methods[enabled]": "true",
      ...(metadata?.service ? { "metadata[service]": metadata.service } : {}),
      ...(metadata?.email ? { "metadata[email]": metadata.email } : {}),
      ...(metadata?.name ? { "metadata[name]": metadata.name } : {}),
      ...(appliedCoupon?.id
        ? {
            "metadata[coupon]": appliedCoupon.id,
            "metadata[original_amount]": String(amount),
          }
        : {}),
    });

    const response = await stripePost("payment_intents", STRIPE_SECRET_KEY, params);
    const data = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", data);
      return jsonResponse(
        { error: data.error?.message || "Payment failed" },
        response.status
      );
    }

    return jsonResponse({
      clientSecret: data.client_secret,
      amount: finalAmount,
      originalAmount: amount,
      discountApplied: appliedCoupon
        ? {
            id: appliedCoupon.id,
            percentOff: appliedCoupon.percent_off ?? null,
            amountOff: appliedCoupon.amount_off ?? null,
          }
        : null,
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
