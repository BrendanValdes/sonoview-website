import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How long does the appointment take?",
    a: "Appointment length varies by service and typically ranges from 20 minutes to 1 hour.",
  },
  {
    q: "When is the best time for 3D/4D imaging?",
    a: "The ideal window for 3D/4D imaging is typically between 26–32 weeks, when facial features are more developed.",
  },
  {
    q: "Can I bring guests to my appointment?",
    a: "Yes, guests are welcome. We encourage sharing the experience with loved ones.",
  },
  {
    q: "What if baby's position makes imaging difficult?",
    a: "Image clarity depends on baby's position. If needed, additional time may be used to obtain optimal views.",
  },
  {
    q: "Do you accept insurance?",
    a: "We are a self-pay practice and do not bill insurance directly. Transparent self-pay rates are listed for each service. Please contact us if you have questions about coverage or documentation.",
  },
];

const FAQSection = () => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto max-w-3xl px-5 sm:px-4">
      <div className="mb-10 text-center sm:mb-14">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map(({ q, a }, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-center text-sm font-medium text-foreground font-body py-4 sm:text-base sm:py-5 justify-center">
              {q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground font-body leading-relaxed pb-4 sm:pb-5 text-center">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
