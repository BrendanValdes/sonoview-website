import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Timer, ImageIcon, UserCheck, Globe, Camera, Heart, Lock, CalendarClock, Shield, HeartPulse, Clock, type LucideIcon } from "lucide-react";

interface Bullet {
  text: string;
  icon: LucideIcon;
}

interface Service {
  id: string;
  name: string;
  tagline: string;
  bullets: Bullet[];
  cta: string;
  recommended?: boolean;
  url?: string;
}

const SERVICES: Service[] = [
  {
    id: "early-pregnancy",
    name: "Early Pregnancy Ultrasound",
    tagline: "Confirm your pregnancy and hear your baby's heartbeat for the first time.",
    bullets: [
      { text: "Available from 6-16 weeks", icon: Clock },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "Private stress-free environment", icon: Shield },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Schedule Your Early Pregnancy Ultrasound",
    url: "https://api.leadconnectorhq.com/widget/booking/vFgu5oBNOMwUB93TAICz",
    recommended: true,
  },
  {
    id: "gender-reveal",
    name: "Gender Reveal Experience",
    tagline: "Find out if it's a boy or girl in the most magical way possible.",
    bullets: [
      { text: "16+ weeks", icon: Clock },
      { text: "Your gender reveal moment captured privately", icon: Camera },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "Warm intimate setting", icon: Heart },
      { text: "Limited weekly appointments", icon: CalendarClock },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Schedule Your Gender Reveal",
    url: "https://api.leadconnectorhq.com/widget/booking/ok0nm6l9eQnFxRRCaD8y",
  },
  {
    id: "bonding",
    name: "Signature 3D/4D Bonding Experience",
    tagline: "An unforgettable chance to meet your baby before they arrive.",
    bullets: [
      { text: "20–32 weeks", icon: Clock },
      { text: "Unhurried 3D/4D imaging session", icon: Timer },
      { text: "Keepsake printed photos included", icon: ImageIcon },
      { text: "20+ years of sonography experience", icon: UserCheck },
      { text: "Beautiful imaging in a calm private setting", icon: Heart },
      { text: "Se habla español", icon: Globe },
    ],
    cta: "Schedule Your Bonding Experience",
    url: "https://api.leadconnectorhq.com/widget/booking/b4QNtnb92RWB7pwIcTOv",
  },
];

const ServiceCard = ({ service }: { service: Service }) => {
  const navigate = useNavigate();
  return (
    <div
      id={service.id}
      className={`group relative flex flex-col rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-lg sm:p-10 ${
        service.recommended
          ? "border-primary/40 shadow-md ring-1 ring-primary/20"
          : "border-border hover:border-primary/20"
      }`}
    >
      {service.recommended && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground font-body">
            Most Popular
          </span>
        </div>
      )}
      <div className="flex-1 text-center">
        <h3 className="mb-1 text-lg font-bold tracking-tight text-foreground sm:min-h-[3.5rem]">{service.name}</h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground font-body sm:min-h-[2.5rem]">{service.tagline}</p>
        <ul className="mb-6 inline-flex flex-col space-y-3 text-left">
          {service.bullets.map(({ text, icon: Icon }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-primary font-body">
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
        onClick={() => navigate(`/book?service=${service.id}`)}
      >
        {service.cta}
      </Button>
    </div>
  );
};

const ServicesSection = () => (
  <section id="services" className="py-20 sm:py-32">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16">
        <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Pregnancy Reassurance & Bonding Ultrasounds
        </h2>
        <p className="text-sm text-muted-foreground font-body sm:text-base">
          Choose the experience that feels right for you — and schedule your visit in just minutes.
        </p>
      </div>

      <div className="mx-auto grid max-w-sm gap-6 sm:max-w-5xl sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <ServiceCard key={s.name} service={s} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
