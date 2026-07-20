import { useState } from "react";
import { Phone, Menu, Baby } from "lucide-react";
import sonoviewLogo from "@/assets/sonoview-logo-transparent.webp";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PHONE = "(775) 305-7868";
const PHONE_HREF = "tel:+17753057868";
const BOOKING_URL = "https://www.sonoviewforyou.com/book-online";

const NAV_LINKS = [
  { label: "Pregnancy Experiences", href: "/#services", icon: Baby },
];

const StickyHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
        <a href="/" className="flex items-center gap-1">
          <img src={sonoviewLogo} alt="Sonoview For You" width={60} height={60} fetchPriority="high" className="h-12 w-auto sm:h-[3.75rem]" />
          <span className="text-base font-bold text-foreground font-display sm:text-lg">
            SonoView <span className="font-normal text-muted-foreground">For You</span>
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground font-body"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </a>
            ))}
          </nav>

          {/* Phone - desktop only */}
          <a
            href={PHONE_HREF}
            onClick={() => { (window as any).gtag_report_conversion?.(PHONE_HREF); }}
            className="hidden items-center gap-1.5 text-sm font-semibold text-foreground sm:flex font-body"
          >
            <Phone className="h-4 w-4 text-primary" />
            {PHONE}
          </a>

          {/* CTA - hidden on very small screens */}
          <a href="/book" className="hidden sm:block">
            <Button variant="cta" size="default" className="font-body text-sm">
              Book Now
            </Button>
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card pt-12">
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-base font-medium text-foreground font-body py-2 border-b border-border"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </a>
                ))}
                <a href={PHONE_HREF} onClick={() => { (window as any).gtag_report_conversion?.(PHONE_HREF); }} className="flex items-center gap-2 text-base text-foreground font-body py-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {PHONE}
                </a>
                <a href="/book" className="mt-4">
                  <Button variant="cta" size="lg" className="w-full font-body">
                    Book Your Private Ultrasound
                  </Button>
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
