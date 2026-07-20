import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanSearch } from "lucide-react";

const BOOKING_URL = "https://www.sonoviewforyou.com/book-online";

const GeneralServicesSection = () => (
  <section className="py-16 sm:py-20">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          Also Offering Medical &amp; Preventative Ultrasounds
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Professional screening and general imaging services performed in a calm, private setting
          — backed by over 20 years of clinical experience.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {/* Preventative */}
        <div className="flex flex-col items-start rounded-xl border border-border bg-card p-6 sm:p-10">
          <ShieldCheck className="mb-4 h-8 w-8 text-primary" />
          <h3 className="mb-2 text-xl font-bold text-foreground">View Preventative Screenings</h3>
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            Proactive health checks including stroke risk and aneurysm screening.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="cta" size="lg" className="w-full sm:w-auto">
              View Screenings
            </Button>
          </a>
        </div>

        {/* General Imaging */}
        <div className="flex flex-col items-start rounded-xl border border-border bg-card p-6 sm:p-10">
          <ScanSearch className="mb-4 h-8 w-8 text-primary" />
          <h3 className="mb-2 text-xl font-bold text-foreground">View Medical Imaging Services</h3>
          <p className="mb-6 text-sm text-muted-foreground sm:text-base">
            Targeted ultrasounds for breast, thyroid, abdominal, pelvic, and soft tissue concerns.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="cta" size="lg" className="w-full sm:w-auto">
              View Ultrasounds
            </Button>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default GeneralServicesSection;
