import { lazy, Suspense } from "react";
import SEO from "@/components/SEO";
import StickyHeader from "@/components/landing/StickyHeader";
import HeroSection from "@/components/landing/HeroSection";
import TrustBar from "@/components/landing/TrustBar";

// Defer below-the-fold sections from the initial bundle
const TestimonialFeature = lazy(() => import("@/components/landing/TestimonialFeature"));
const ServicesSection = lazy(() => import("@/components/landing/ServicesSection"));
const ThreeDFourDSection = lazy(() => import("@/components/landing/ThreeDFourDSection"));
const TestimonialMiranda = lazy(() => import("@/components/landing/TestimonialMiranda"));
const MeetSonographer = lazy(() => import("@/components/landing/MeetSonographer"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => (
  <>
    <SEO
      title="3D/4D Ultrasound in Reno NV | SonoView For You — Pregnancy Bonding Studio"
      description="Reno's premier private 3D/4D ultrasound studio. Pregnancy bonding, gender reveal & early pregnancy scans by ARDMS-certified sonographer with 20+ years' experience. Book today."
    />
    <StickyHeader />
    <main>
      <HeroSection />
      <TrustBar />
      <Suspense fallback={<SectionFallback />}>
        <TestimonialFeature />
        <ServicesSection />
        <ThreeDFourDSection />
        <TestimonialMiranda />
        <MeetSonographer />
        <FAQSection />
      </Suspense>
    </main>
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </>
);

export default Index;
