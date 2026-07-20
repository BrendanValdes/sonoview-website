import { Button } from "@/components/ui/button";
import { GraduationCap, Heart, Hospital, Globe } from "lucide-react";
import juliePhoto from "@/assets/julie-hayes.webp";

const BOOKING_URL = "/book";

const CREDENTIALS = [
  { text: "Diagnostic Sonography Instructor", icon: GraduationCap },
  { text: "Private, patient-centered approach", icon: Heart },
  { text: "Hospital-trained expertise", icon: Hospital },
  { text: "Se habla español", icon: Globe },
];

const MeetSonographer = () => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto px-5 sm:px-4">
      <div className="mx-auto grid max-w-5xl items-center gap-10 sm:gap-12 lg:grid-cols-2">
        {/* Photo */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={juliePhoto}
            alt="Julie Hayes, ARDMS, RVT — Founder and Lead Sonographer at SonoView For You"
            className="w-64 rounded-2xl object-cover shadow-xl sm:w-auto sm:max-w-[420px]"
            loading="lazy"
            width={420}
            height={560}
          />
        </div>

        {/* Bio */}
        <div className="text-center">
          <h2 className="mb-5 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl">
            Meet the Sonographer Families Across Northern Nevada Trust
          </h2>
          <p className="mb-1 text-lg font-semibold text-foreground font-body">
            Julie Hayes, ARDMS, RVT
          </p>
          <p className="mb-3 text-sm text-muted-foreground font-body">
            Founder & Lead Sonographer
          </p>
          <p className="mb-5 text-sm font-medium text-primary font-body">
            ARDMS — the highest national certification in diagnostic ultrasound
          </p>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground font-body sm:text-base">
            With over two decades of hospital and outpatient experience, Julie
            is known for her calm presence, clinical precision, and deeply
            compassionate care — creating an ultrasound experience where
            patients feel comfortable, unrushed, and fully supported.
          </p>
          <ul className="mb-6 inline-flex flex-col space-y-2 text-left">
            {CREDENTIALS.map(({ text, icon: Icon }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-foreground font-body">
                <Icon className="h-4 w-4 text-primary" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mb-2 text-sm font-semibold font-body">
            <a href="https://maps.apple.com/?address=255+Bell+Street+Suite+104,+Reno,+NV+89503" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
              255 Bell Street Suite 104, Reno NV
            </a>
          </p>
          <p className="mb-8 text-sm italic text-muted-foreground font-body">
            Trusted by hundreds of Northern Nevada families for over 20 years.
          </p>
          <a href={BOOKING_URL}>
            <Button variant="cta" size="lg" className="font-body">
              Book Your Private Ultrasound
            </Button>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default MeetSonographer;
