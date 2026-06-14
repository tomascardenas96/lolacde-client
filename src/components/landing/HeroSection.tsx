export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={{
            backgroundImage: "url('/assets/images/hero2.jpeg')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 to-black" />
        {/* Champagne glow behind the headline */}
        <div className="glow-accent absolute inset-0 z-[1]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto items-center">
        <div
          className="flex items-center justify-center mb-10 gap-3 animate-fade-in-up"
          style={{ animationDelay: "120ms" }}
        >
          <div className="w-8 h-px bg-accent" />
          <p className="text-xs tracking-[0.35em] text-accent font-light uppercase">
            + Más de 20 años de experiencia
          </p>
          <div className="w-8 h-px bg-accent" />
        </div>

        <h1
          className="heading-display text-5xl md:text-7xl lg:text-[5.5rem] text-white mb-16 wrap-break-word animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          EL ARTE DE LA
          <br />
          TRANSFORMACIÓN.
        </h1>

        <div
          className="flex items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "420ms" }}
        >
          <a
            href="#booking"
            className="border border-accent px-8 py-5 text-xs tracking-[0.2em] text-black bg-accent hover:bg-transparent hover:text-accent hover:border-accent transition-all"
          >
            RESERVAR UN TURNO
          </a>
          <a
            href="#services"
            className="border border-white/40 px-8 py-5 text-xs tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all"
          >
            NUESTROS SERVICIOS
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-in-up"
        style={{ animationDelay: "640ms" }}
      >
        <span className="text-[10px] tracking-[0.3em] text-accent/60 uppercase">
          Scroll
        </span>
        <div className="w-px h-8 bg-accent/30" />
      </div>
    </section>
  );
}
