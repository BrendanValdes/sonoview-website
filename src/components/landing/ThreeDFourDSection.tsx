import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const ThreeDFourDSection = () => (
  <section id="3d4d" className="section-alt py-20 sm:py-32">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="border-t border-border pt-10 sm:pt-12">
          <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">
            Not sure which session is right for you?
          </h3>
          <p className="mb-6 text-sm text-muted-foreground font-body sm:text-base">
            Call us — we're happy to guide you.
          </p>
          <a href="tel:+17753057868" onClick={() => { (window as any).gtag_report_conversion?.("tel:+17753057868"); }}>
            <Button variant="ctaOutline" size="lg" className="font-body">
              <Phone className="mr-2 h-4 w-4" />
              Call Us
            </Button>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ThreeDFourDSection;
