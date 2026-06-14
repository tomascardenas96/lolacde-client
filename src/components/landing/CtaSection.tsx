import { Reveal } from "@/components/ui/Reveal";

export function CtaSection() {
  return (
    <section className="relative px-6 md:px-24 py-40 bg-background text-center overflow-hidden">
      {/* Soft champagne glow centered behind the call-to-action */}
      <div className="glow-accent absolute inset-0 pointer-events-none" />
      <Reveal className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-px bg-accent/40" />
          <p className="text-[10px] tracking-[0.35em] text-accent uppercase">
            CONTACTANOS
          </p>
          <div className="w-12 h-px bg-accent/40" />
        </div>
        <h2 className="heading-display text-5xl md:text-6xl lg:text-6xl text-white mb-8">
          ¿QUERES CONTACTARTE CON NOSOTROS?
        </h2>
        <p className="text-sm text-muted mb-12 max-w-lg mx-auto">
          Envianos un mensaje y te responderemos a la brevedad.
        </p>
        <a
          href="https://wa.me/5492281576513"
          className="inline-block border border-accent bg-accent text-black px-14 py-5 text-xs tracking-[0.25em] font-medium hover:bg-transparent hover:text-accent transition-all"
        >
          ENVIAR WHATSAPP
        </a>
      </Reveal>
    </section>
  );
}
