import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.webp";
import heroBgMobile from "@/assets/hero-bg-mobile.webp";

const BOOKING_URL = "/book";

const HeroSection = () => (
  <section className="relative flex flex-col overflow-hidden sm:min-h-[85vh] sm:items-center sm:justify-center">
    {/* Mobile layout */}
    <div className="relative flex min-h-[85vh] flex-col justify-end sm:hidden">
      <img
        src={heroBgMobile}
        alt="Sonographer performing pregnancy ultrasound"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={828}
        height={828}
        className="absolute inset-0 h-full w-full object-cover object-[75%_15%]"
      />
      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 25%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      <div className="relative px-5 pb-10 pt-16 text-center">
        <h1 className="mx-auto mb-4 max-w-none text-center text-[1.6rem] font-bold leading-tight text-white [text-wrap:nowrap] whitespace-nowrap min-[768px]:text-4xl">
          Meet Your Baby Sooner,<br />
          On Your Terms,<br />
          Not the Hospital's.
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-white/90 font-body">
          Private 3D & 4D pregnancy ultrasounds backed by 20+ years of clinical experience, so you can leave reassured and confident.
          <br />
          Limited weekly appointments. Book early.
        </p>
        <p className="mb-2 text-xs font-semibold tracking-wide text-white/90 font-body">
          Proudly serving Northern Nevada families.
        </p>
        <p className="mb-4 text-xs italic text-white/80 font-body">
          Se habla español
        </p>
        <a href={BOOKING_URL}>
          <Button variant="cta" size="lg" className="text-xs">
            Book Your Private Ultrasound
          </Button>
        </a>
        <div className="mt-5">
          <p className="text-xs text-white/80 font-body">
            Complimentary printed keepsake images included with sessions booked through May 30th.
          </p>
        </div>
      </div>
    </div>

    {/* Desktop layout */}
    <img
      src={heroBg}
      alt="SonoView For You ultrasound clinic"
      loading="eager"
      fetchPriority="high"
      decoding="async"
      width={1536}
      height={672}
      className="absolute inset-0 hidden h-full w-full object-cover object-center sm:block"
    />
    <div className="absolute inset-0 hidden bg-black/25 sm:block" />
    <div className="container relative mx-auto hidden px-4 py-24 text-center sm:block">
      <div className="animate-fade-in-up mx-auto max-w-3xl">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl whitespace-nowrap">
          Meet Your Baby Sooner,<br />
          On Your Terms,<br />
          Not the Hospital's
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 font-body">
          Private 3D & 4D pregnancy ultrasounds backed by 20+ years of clinical experience, so you can leave reassured and confident.
          <br />
          Limited weekly appointments. Book early.
        </p>
        <p className="mb-2 text-base font-semibold tracking-wide text-white/90 font-body">
          Proudly serving Northern Nevada families.
        </p>
        <p className="mb-6 text-sm italic text-white/80 font-body">
          Se habla español
        </p>
        <a href={BOOKING_URL}>
          <Button variant="cta" size="lg" className="text-sm">
            Book Your Private Ultrasound
          </Button>
        </a>
      </div>
      <div className="animate-fade-in-up animate-delay-300 mt-16">
        <div className="inline-block rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
          <p className="text-sm text-white/90 font-body">
            Complimentary printed keepsake images included with sessions booked through May 30th.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
