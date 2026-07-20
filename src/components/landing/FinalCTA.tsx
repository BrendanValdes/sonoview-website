import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultiStepForm from "./MultiStepForm";

const FinalCTA = () => (
  <section className="cta-gradient py-20">
    <div className="container mx-auto px-4">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Schedule Your Ultrasound Today
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Fast scheduling, trusted care, and transparent pricing. Your appointment is just a few
            clicks — or one phone call — away.
          </p>
          <a href="tel:+17753057868" onClick={() => { (window as any).gtag_report_conversion?.("tel:+17753057868"); }}>
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Phone className="mr-2 h-5 w-5" />
              (775) 305-7868
            </Button>
          </a>
        </div>
        <MultiStepForm id="final-form" />
      </div>
    </div>
  </section>
);

export default FinalCTA;
