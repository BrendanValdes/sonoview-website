import { Award, Clock, DollarSign, Heart, Monitor, Shield } from "lucide-react";

const BENEFITS = [
  { icon: Award, title: "20+ Years Clinical Experience", desc: "ARDMS- and RVT-certified with thousands of scans performed." },
  { icon: Clock, title: "No Hospital Wait Times", desc: "Schedule on your terms — no long waits, no runarounds." },
  { icon: DollarSign, title: "Transparent, Upfront Pricing", desc: "Know exactly what you'll pay before your appointment." },
  { icon: Shield, title: "Private, Comfortable Environment", desc: "A calm, welcoming space designed around your comfort." },
  { icon: Monitor, title: "Modern Imaging Technology", desc: "State-of-the-art equipment for clear, accurate results." },
  { icon: Heart, title: "Compassionate, Personalized Care", desc: "Every patient is treated with kindness and respect." },
];

const WhyChooseUs = () => (
  <section className="section-alt py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Why Choose SonoView For You</h2>
        <p className="text-muted-foreground">
          Trusted, professional imaging — right here in Northern Nevada.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
