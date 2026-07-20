import { Heart } from "lucide-react";

const TestimonialMiranda = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-card px-6 py-10 sm:px-12 sm:py-12 shadow-sm">
        <div className="flex flex-col items-start gap-6">
          <div className="flex-1">
            {/* Decorative opening quote */}
            <div
              aria-hidden="true"
              className="font-serif text-6xl leading-none text-primary"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              &ldquo;
            </div>

            <p
              className="mt-1 text-lg leading-relaxed text-foreground sm:text-xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              From the moment I walked in, she made me feel comfortable and completely at ease. She took her time, explained everything clearly, and you can tell she truly loves what she does and cares about her patients. I would highly recommend her to anyone she is truly amazing.
            </p>

            {/* Decorative closing quote */}
            <div
              aria-hidden="true"
              className="text-right font-serif text-6xl leading-none text-primary"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              &rdquo;
            </div>

            <hr className="my-6 border-border" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary">
                <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base font-semibold tracking-wide text-foreground">
                  MIRANDA JONES
                </p>
                <p className="text-sm text-muted-foreground">Facebook Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialMiranda;
