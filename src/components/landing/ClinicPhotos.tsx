import clinicRoom from "@/assets/clinic-room.webp";
import providerScanning from "@/assets/provider-scanning.webp";
import equipment from "@/assets/equipment.webp";
import clinicExterior from "@/assets/clinic-exterior.webp";

const images = [
  { src: clinicRoom, alt: "SonoView ultrasound room with modern equipment" },
  { src: providerScanning, alt: "Professional sonographer performing an ultrasound scan" },
  { src: equipment, alt: "State-of-the-art ultrasound imaging equipment" },
  { src: clinicExterior, alt: "Clean, welcoming clinic reception area" },
];

const ClinicPhotos = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Inside Our Clinic</h2>
        <p className="text-muted-foreground">
          A professional, clinical environment built for accuracy and your comfort.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map(({ src, alt }) => (
          <div key={alt} className="overflow-hidden rounded-xl">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClinicPhotos;
