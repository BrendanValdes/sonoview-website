import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Index from "./pages/Index";
import Book from "./pages/Book";
import { useAnalytics } from "./hooks/useAnalytics";
import { getStripe } from "./lib/stripeLoader";

// Initialize Stripe.js once at app startup so it's cached & ready before
// the user reaches the payment step. getStripe() is singleton-memoized.
getStripe();

// Code-split heavy/secondary routes so the landing page bundle stays small
const Terms = lazy(() => import("./pages/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Analytics = () => {
  useAnalytics();
  return null;
};

const GHL_SCRIPT_ID = "ghl-chat-widget-script";

// Selector targets ONLY the LeadConnector chat widget — must not match the
// GHL booking iframe (api.leadconnectorhq.com/widget/booking/...) which is
// React-managed and would crash with removeChild if torn down externally.
const WIDGET_SELECTOR =
  'chat-widget, #lc_text_widget, [id^="lc_"], [class*="lc-widget"]';

const isBookingIframe = (el: Element) =>
  el.tagName === "IFRAME" &&
  /leadconnectorhq\.com\/widget\/booking/i.test((el as HTMLIFrameElement).src || "");

const removeWidgetNodes = () => {
  document.querySelectorAll(WIDGET_SELECTOR).forEach((el) => {
    if (isBookingIframe(el)) return;
    el.remove();
  });
};

const ChatWidgetGate = () => {
  useEffect(() => {
    // Chat widget fully disabled site-wide. Remove any pre-existing loader
    // script and continuously strip injected widget DOM nodes.
    document.body.setAttribute("data-hide-chat", "true");
    const existingScript = document.getElementById(GHL_SCRIPT_ID);
    if (existingScript) existingScript.remove();
    removeWidgetNodes();

    const observer = new MutationObserver(() => removeWidgetNodes());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.body.removeAttribute("data-hide-chat");
    };
  }, []);
  return null;
};

const ScrollToHash = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    let attempts = 0;
    const maxAttempts = 10;
    const tryScroll = () => {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 200);
      }
    };
    const timer = setTimeout(tryScroll, 100);
    return () => clearTimeout(timer);
  }, [hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <ChatWidgetGate />
        <Analytics />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<Book />} />
            <Route path="/schedule" element={<Book />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
