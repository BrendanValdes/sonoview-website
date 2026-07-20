import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Inject <link rel="preload"> tags for hero images using their hashed build URLs.
// Mobile preload is media-gated to <640px so desktop users don't download it (and vice versa).
function heroPreloadPlugin(): Plugin {
  return {
    name: "hero-preload",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        let mobileUrl = "";
        let desktopUrl = "";
        for (const fileName of Object.keys(bundle)) {
          if (/hero-bg-mobile.*\.webp$/.test(fileName)) mobileUrl = "/" + fileName;
          else if (/hero-bg-[A-Za-z0-9_-]+\.webp$/.test(fileName) && !/mobile/.test(fileName))
            desktopUrl = "/" + fileName;
        }
        const tags: string[] = [];
        if (mobileUrl) {
          tags.push(
            `<link rel="preload" as="image" href="${mobileUrl}" type="image/webp" fetchpriority="high" media="(max-width: 639px)" />`
          );
        }
        if (desktopUrl) {
          tags.push(
            `<link rel="preload" as="image" href="${desktopUrl}" type="image/webp" fetchpriority="high" media="(min-width: 640px)" />`
          );
        }
        if (!tags.length) return html;
        return html.replace("</head>", `  ${tags.join("\n  ")}\n  </head>`);
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    heroPreloadPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
