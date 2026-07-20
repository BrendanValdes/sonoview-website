import { CirclePlus, Armchair, Clock } from "lucide-react";

const PILLARS = [
  { icon: CirclePlus, label: "Hospital-Level Expertise", mobileOrder: "order-1" },
  { icon: Armchair, label: "Private, Calm Environment", mobileOrder: "order-3 sm:order-2" },
  { icon: Clock, label: "Appointments That Are Never Rushed", mobileOrder: "order-2 sm:order-3" },
];

const TrustBar = () => (
  <section className="border-y border-border bg-card py-14 sm:py-16">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16 lg:gap-24">
        {PILLARS.map(({ icon: Icon, label, mobileOrder }) => (
          <div key={label} className={`flex flex-col items-center gap-3 text-center ${mobileOrder}`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-14 sm:w-14">
              <Icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold tracking-wide text-foreground font-body sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
