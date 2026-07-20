import testimonialImg from "@/assets/testimonial-shannon.jpeg";

const TestimonialFeature = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          What Expecting Mamas Are Saying
        </h2>
      </div>
      <div className="mx-auto max-w-3xl">
        <img
          src={testimonialImg}
          alt="Facebook review from Shannon Payen praising Julie's early 8 week scan, kindness and thoroughness."
          loading="lazy"
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </div>
  </section>
);

export default TestimonialFeature;
