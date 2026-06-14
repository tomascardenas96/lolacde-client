import { Reveal } from "@/components/ui/Reveal";

export function AboutSection() {
  return (
    <section className="px-6 md:px-24 2xl:px-28 py-24 bg-background">
      {/* Top text area */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-16 gap-8">
        <Reveal className="max-w-xl">
          <h2 className="heading-display text-4xl md:text-6xl text-white mb-8">
            UTILIZAMOS PRODUCTOS DE LA
            <br />
            MEJOR CALIDAD.
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-md">
            En Lola Centro de Estética, nos comprometemos a ofrecerte resultados
            excepcionales utilizando únicamente productos de la más alta
            calidad. Trabajamos con las mejores marcas del mercado para
            garantizar tratamientos seguros, efectivos y duraderos.
          </p>
        </Reveal>
        <p className="text-xs tracking-[0.3em] text-accent self-start md:self-end">
          EST. 2026
        </p>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[400px] md:h-[500px]">
        <Reveal className="md:col-span-3 relative overflow-hidden rounded-sm group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{
              backgroundImage: "url('/assets/images/about1.jpeg')",
            }}
          />
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 ease-in-out group-hover:opacity-0" />
        </Reveal>
        <Reveal
          delay={120}
          className="md:col-span-2 relative overflow-hidden rounded-sm group"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-110"
            style={{
              backgroundImage: "url('/assets/images/about2.jpeg')",
            }}
          />
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 ease-in-out group-hover:opacity-0" />
        </Reveal>
      </div>
    </section>
  );
}
