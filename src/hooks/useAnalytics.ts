import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const gtag = (...args: any[]) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
};

/**
 * Site-wide analytics:
 * - SPA page_view on every route change
 * - Scroll depth (25/50/75/90/100)
 * - Outbound link clicks
 * - Button clicks (CTAs detected by text/role)
 * - Form submissions (generate_lead conversion)
 * - Video plays (HTML5 <video>)
 * - Time on page (engagement_time_msec on unload)
 */
export const useAnalytics = () => {
  const location = useLocation();
  const pageStartRef = useRef<number>(Date.now());
  const scrollMarksRef = useRef<Set<number>>(new Set());

  // Track SPA page views + reset per-page state
  useEffect(() => {
    const path = location.pathname + location.search + location.hash;

    // Defer by two frames so react-helmet-async has committed the new
    // <title> before we read document.title for the page_view event.
    let raf2: number | null = null;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "page_view",
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        });
      });
    });

    pageStartRef.current = Date.now();
    scrollMarksRef.current = new Set();

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2 !== null) cancelAnimationFrame(raf2);
    };
  }, [location.pathname, location.search, location.hash]);

  // Global listeners (mounted once)
  useEffect(() => {
    // --- Scroll depth ---
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = (doc.scrollHeight || 0) - window.innerHeight;
      if (height <= 0) return;
      const pct = Math.round((scrollTop / height) * 100);
      [25, 50, 75, 90, 100].forEach((mark) => {
        if (pct >= mark && !scrollMarksRef.current.has(mark)) {
          scrollMarksRef.current.add(mark);
          gtag("event", "scroll", {
            percent_scrolled: mark,
            page_path: window.location.pathname,
          });
        }
      });
    };

    // --- Click handler: outbound links + button clicks ---
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor && anchor.href) {
        const href = anchor.href;
        try {
          const url = new URL(href, window.location.href);
          const isHttp = url.protocol === "http:" || url.protocol === "https:";
          const isOutbound = isHttp && url.hostname !== window.location.hostname;
          if (isOutbound) {
            gtag("event", "click", {
              event_category: "outbound",
              event_label: href,
              outbound: true,
              link_url: href,
              link_domain: url.hostname,
            });
          }
          // Treat tel:/mailto: as engagement clicks
          if (url.protocol === "tel:") {
            gtag("event", "click_to_call", { link_url: href });
          } else if (url.protocol === "mailto:") {
            gtag("event", "click_to_email", { link_url: href });
          }
        } catch {
          /* noop */
        }
      }

      const button = target.closest(
        "button, [role='button'], a[data-cta], button[data-cta]"
      ) as HTMLElement | null;
      if (button) {
        const label =
          (button.getAttribute("data-cta") ||
            button.getAttribute("aria-label") ||
            button.innerText ||
            "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 100);
        if (label) {
          const isCta = /book|get started|schedule|call|continue|submit|appointment|reserve|buy|checkout/i.test(
            label
          );
          gtag("event", isCta ? "cta_click" : "button_click", {
            button_text: label,
            page_path: window.location.pathname,
          });
        }
      }
    };

    // --- Form submissions => generate_lead (conversion) ---
    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null;
      const formId = form?.id || form?.getAttribute("name") || "form";
      gtag("event", "generate_lead", {
        form_id: formId,
        page_path: window.location.pathname,
      });
    };

    // --- Video plays (delegate to all <video> elements, including future ones) ---
    const onPlay = (e: Event) => {
      const video = e.target as HTMLVideoElement | null;
      if (!video || video.tagName !== "VIDEO") return;
      gtag("event", "video_start", {
        video_title: video.title || video.currentSrc || "video",
        video_url: video.currentSrc,
      });
    };

    // --- Time on page (sent on hide/unload) ---
    const sendEngagement = () => {
      const ms = Date.now() - pageStartRef.current;
      if (ms < 1000) return;
      gtag("event", "user_engagement", {
        engagement_time_msec: ms,
        page_path: window.location.pathname,
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendEngagement();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("play", onPlay, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("play", onPlay, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendEngagement);
    };
  }, []);
};

/** Fire a purchase conversion (call after a booking/payment completes).
 *  Pushes to window.dataLayer so Google Tag Manager can pick it up and fire
 *  the configured GA4 purchase conversion tag.
 */
export const trackPurchase = (params: {
  value?: number;
  currency?: string;
  transaction_id?: string;
  items?: Array<{ item_name: string; price?: number; quantity?: number }>;
}) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // Clear previous ecommerce object to avoid data bleed between events (GTM best practice)
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      currency: params.currency || "USD",
      value: params.value ?? 0,
      transaction_id: params.transaction_id,
      items: params.items,
    },
  });
};

/** Fire a generate_lead conversion manually (e.g., custom flows). */
export const trackLead = (params: Record<string, any> = {}) => {
  gtag("event", "generate_lead", params);
};

/** Fire begin_checkout (booking step 1: service selection loaded). */
export const trackBeginCheckout = (params: {
  value?: number;
  currency?: string;
  items?: Array<{ item_id?: string; item_name: string; price?: number; quantity?: number }>;
} = {}) => {
  gtag("event", "begin_checkout", {
    currency: params.currency || "USD",
    value: params.value ?? 0,
    items: params.items,
  });
};

/** Fire form_start (booking step 2: client details form loaded). */
export const trackFormStart = (params: Record<string, any> = {}) => {
  gtag("event", "form_start", params);
};

/** Fire add_payment_info (booking step 3: payment step loaded). */
export const trackAddPaymentInfo = (params: {
  value?: number;
  currency?: string;
  payment_type?: string;
  items?: Array<{ item_id?: string; item_name: string; price?: number; quantity?: number }>;
} = {}) => {
  gtag("event", "add_payment_info", {
    currency: params.currency || "USD",
    value: params.value ?? 0,
    payment_type: params.payment_type || "card",
    items: params.items,
  });
};

/** Fire schedule (booking step 4: scheduling step loaded). */
export const trackSchedule = (params: Record<string, any> = {}) => {
  gtag("event", "schedule", params);
};
