/**
 * Inject preconnect <link> tags at runtime to warm up third-party origins
 * just before they're needed. Idempotent — safe to call multiple times.
 */
export const preconnect = (origins: string[]) => {
  if (typeof document === "undefined") return;
  for (const href of origins) {
    if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`))
      continue;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "";
    document.head.appendChild(link);
  }
};
