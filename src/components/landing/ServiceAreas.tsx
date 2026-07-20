import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServiceAreas = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <MapPin className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
          Proudly Serving Northern Nevada
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Conveniently located for patients in <strong>Reno</strong>, <strong>Sparks</strong>,{" "}
          <strong>Carson City</strong>, and surrounding communities. Trusted local care — no long
          drives or hospital hassles.
        </p>
        <a href="https://www.sonoviewforyou.com/book-online" target="_blank" rel="noopener noreferrer">
          <Button variant="cta" size="xl">
            Schedule Your Appointment
          </Button>
        </a>
      </div>
    </section>
  );
};

export default ServiceAreas;
