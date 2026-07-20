import { Button } from "@/components/ui/button";
import {
  Timer,
  ImageIcon,
  UserCheck,
  Globe,
  Camera,
  Heart,
  CalendarClock,
  Shield,
  Clock,
  type LucideIcon,
} from "lucide-react";
import type { ServiceInfo } from "@/pages/Book";

interface Bullet {
  text: string;
  icon: LucideIcon;
}

interface CardContent {
  tagline: string;
  bullets: Bullet[];
  cta: string;
  recommended?: boolean;
}

const CARD_CONTENT: Record<string, CardContent> = {
  "early-pregnancy": {
    tagline: "Confirm your pregnancy and hear your baby's heartbeat for the first time.",
    bullets: [
      { text: "Available from 6-16 weeks", icon: Clock },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "Private stress-free environment", icon: Shield },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Select Early Pregnancy Ultrasound",
    recommended: true,
  },
  "gender-reveal": {
    tagline: "Find out if it's a boy or girl in the most magical way possible.",
    bullets: [
      { text: "16+ weeks", icon: Clock },
      { text: "Your gender reveal moment captured privately", icon: Camera },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "Warm intimate setting", icon: Heart },
      { text: "Limited weekly appointments", icon: CalendarClock },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Select Gender Reveal",
  },
  bonding: {
    tagline: "An unforgettable chance to meet your baby before they arrive.",
    bullets: [
      { text: "20–32 weeks", icon: Clock },
      { text: "Unhurried 3D/4D imaging session", icon: Timer },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "20+ years of sonography experience", icon: UserCheck },
      { text: "Beautiful imaging in a calm private setting", icon: Heart },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Select Bonding Experience",
  },
};

const BookingServiceSelect = ({
  services,
  onSelect,
}: {
  services: ServiceInfo[];
  onSelect: (s: ServiceInfo) => void;
}) => {
  // Order to match homepage: early-pregnancy, gender-reveal, bonding
  const order = ["early-pregnancy", "gender-reveal", "bonding"];
  const ordered = [...services].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );

  return (
    <div className="mx-auto grid max-w-sm gap-6 sm:max-w-5xl sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
      {ordered.map((service) => {
        const content = CARD_CONTENT[service.id];
        if (!content) return null;
        return (
          <div
            key={service.id}
            className={`group relative flex flex-col rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg sm:p-10 ${
              content.recommended
                ? "border-primary/40 shadow-md ring-1 ring-primary/20"
                : "border-border hover:border-primary/20"
            }`}
          >
            {content.recommended && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <span className="whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground font-body">
                  Most Popular
                </span>
              </div>
            )}
            <div className="flex-1 text-center">
              <h3 className="mb-1 text-lg font-bold tracking-tight text-foreground sm:min-h-[3.5rem]">
                {service.name}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground font-body sm:min-h-[2.5rem]">
                {content.tagline}
              </p>
              <ul className="mb-6 inline-flex flex-col space-y-3 text-left">
                {content.bullets.map(({ text, icon: Icon }) => (
                  <li
                    key={text}
                    className="flex items-center gap-3 text-sm text-primary font-body"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="cta"
              size="lg"
              className="w-full font-body text-sm whitespace-normal leading-snug"
              onClick={() => onSelect(service)}
            >
              {content.cta}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default BookingServiceSelect;
