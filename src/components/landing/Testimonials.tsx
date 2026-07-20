import { Star } from "lucide-react";

const REVIEWS = [
  { quote: "The experience was so professional and comfortable. I felt completely at ease the entire time.", name: "Sarah M.", area: "Reno, NV", stars: 5 },
  { quote: "No waiting, no hassle. I was in and out in under an hour with clear results. Highly recommend!", name: "Jessica T.", area: "Sparks, NV", stars: 5 },
  { quote: "I was nervous, but the staff made everything easy. The imaging was top-notch and the pricing was straightforward.", name: "David R.", area: "Carson City, NV", stars: 5 },
  { quote: "Seeing our baby in 3D was incredible. The provider took extra time to explain everything we were seeing.", name: "Amanda L.", area: "Reno, NV", stars: 5 },
  { quote: "I got my carotid screening done here — fast, affordable, and the results were delivered quickly. Great care.", name: "Robert K.", area: "Sparks, NV", stars: 5 },
];

const Testimonials = () => (
  <section className="section-alt py-16 sm:py-20">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">What Our Patients Say</h2>
        <p className="text-sm text-muted-foreground sm:text-base">Real stories from people in our community.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.slice(0, 3).map(({ quote, name, area, stars }) => (
          <div key={name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-foreground">"{quote}"</p>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{area}</p>
          </div>
        ))}
      </div>
      {/* Additional reviews in a second row on larger screens */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:mx-auto lg:max-w-2xl">
        {REVIEWS.slice(3).map(({ quote, name, area, stars }) => (
          <div key={name} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-foreground">"{quote}"</p>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{area}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
