import type { Stripe } from "@stripe/stripe-js";

const STRIPE_PK =
  "pk_live_51TMK0wFAH5NJvMHfeyCHmZnzN7j6QiqUZ1aTORQnRfrai9lHVVDw24OlI5TCXQA4oHd8gwryj52Zmm1ApasWh8IH00IzGnnuc9";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Lazily load Stripe.js. Safe to call multiple times — only loads once.
 * Call early (e.g. when user enters details step) to warm cache before payment step renders.
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = import("@stripe/stripe-js").then(({ loadStripe }) =>
      loadStripe(STRIPE_PK)
    );
  }
  return stripePromise;
};
