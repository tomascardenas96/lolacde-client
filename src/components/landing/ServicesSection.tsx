import { ScissorsIcon, SparklesIcon } from "./Icons";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="px-6 md:px-24 2xl:px-28 py-24 bg-background"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-16 gap-8">
        <Reveal className="max-w-xl">
          <h2 className="heading-display text-4xl md:text-6xl text-white mb-8">
            Servicios que ofrecemos para cuidar tu belleza
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-md">
            Contamos con una amplia gama de servicios para satisfacer todas tus
            necesidades de belleza. Desde cortes de pelo hasta tratamientos
            faciales, tenemos todo lo que necesitas para lucir radiante.
          </p>
        </Reveal>
        <p className="text-xs tracking-[0.3em] text-accent self-start md:self-end">
          <Link href="/services">VER SERVICIOS</Link>
        </p>
      </div>
      {/* Two large service cards */}
      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative h-[350px] overflow-hidden rounded-sm group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-8 left-8 z-10">
            <p className="text-[10px] tracking-[0.3em] text-accent mb-2 uppercase">
              Cortes Modernos
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Peluqueria Unisex
            </h3>
          </div>
        </div>

        <div className="relative h-[350px] overflow-hidden rounded-sm group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-8 left-8 z-10">
            <p className="text-[10px] tracking-[0.3em] text-accent mb-2 uppercase">
              Colores Intensos
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Peinados y Colorimetría
            </h3>
          </div>
        </div>
      </Reveal>

      {/* Three smaller service cards */}
      <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-card-light rounded-sm p-8 flex flex-col gap-4">
          <ScissorsIcon />
          <h4 className="text-lg font-bold text-white uppercase tracking-tight">
            Precision Cutting
          </h4>
          <div className="w-6 h-px bg-accent/40" />
          <p className="text-sm text-muted">
            Architectural forms tailored to your structure.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-sm h-[200px] md:h-auto group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs tracking-[0.35em] text-white uppercase">
              Nuestros Productos
            </p>
          </div>
        </div>

        <div className="bg-card-light rounded-sm p-8 flex flex-col gap-4">
          <SparklesIcon />
          <h4 className="text-lg font-bold text-white uppercase tracking-tight">
            Treatment Atelier
          </h4>
          <div className="w-6 h-px bg-accent/40" />
          <p className="text-sm text-muted">
            Restorative rituals for structural integrity.
          </p>
        </div>
      </Reveal>

      <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative h-[350px] overflow-hidden rounded-sm group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: "url('/assets/images/uñas.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-8 left-8 z-10">
            <p className="text-[10px] tracking-[0.3em] text-accent mb-2 uppercase">
              Manos Perfectas
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Uñas y Manicuría
            </h3>
          </div>
        </div>

        <div className="relative h-[350px] overflow-hidden rounded-sm group cursor-pointer">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: "url('/assets/images/mascarilla.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-8 left-8 z-10">
            <p className="text-[10px] tracking-[0.3em] text-accent mb-2 uppercase">
              Piel Radiante
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              Cuidados del Rostro
            </h3>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
