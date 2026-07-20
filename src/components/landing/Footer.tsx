import { Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <h3 className="text-lg font-bold text-foreground font-display">SonoView For You</h3>
          <p className="text-xs text-muted-foreground font-body">
            ARDMS • RVT &nbsp;|&nbsp; 20+ Years Clinical Experience
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
          <a
            href="tel:+17753057868"
            onClick={() => { (window as any).gtag_report_conversion?.("tel:+17753057868"); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body"
          >
            <Phone className="h-4 w-4" /> (775) 305-7868
          </a>
          <a
            href="mailto:care@sonoviewforyou.com"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body"
          >
            <Mail className="h-4 w-4" /> care@sonoviewforyou.com
          </a>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <a
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground underline font-body"
          >
            Terms & Conditions
          </a>
          <a
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-foreground underline font-body"
          >
            Privacy Policy
          </a>
        </div>
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} SonoView For You. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
