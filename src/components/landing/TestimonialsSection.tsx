import { QuoteIcon } from "./Icons";
import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  {
    quote:
      "Me encanta como me deja el pelo, siempre salgo feliz de su salón. 💗",
    name: "MARTA COSTILLA",
    role: "CLIENTA",
    avatar: "MC",
  },
  {
    quote:
      "El ambiente minimalista permite que el arte hable por sí mismo. Una experiencia verdaderamente trascendente.",
    name: "JULIA BENITEZ",
    role: "CLIENTA",
    avatar: "JB",
  },
  {
    quote:
      "Por fin un espacio que entiende el cabello como una extensión de la arquitectura. Un trabajo de color brillante.",
    name: "VALERIA LOPEZ",
    role: "CLIENTA",
    avatar: "VL",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-6 md:px-24 2xl:px-28 py-32 bg-background">
      <Reveal>
        <p className="text-[10px] tracking-[0.35em] text-accent mb-4 uppercase">
          Testimonios
        </p>
        <h2 className="heading-display text-4xl md:text-6xl text-white mb-16 max-w-3xl">
          VOCES DE NUESTROS CLIENTES.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 120}
            className="bg-card rounded-sm p-8 flex flex-col justify-between min-h-[280px]"
          >
            <div className="flex justify-between items-start mb-6">
              <p className="text-lg md:text-xl font-semibold text-white leading-snug max-w-[85%]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <QuoteIcon accent />
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <div className="w-10 h-10 rounded-full bg-card-light flex items-center justify-center text-xs font-bold text-muted">
                {t.avatar}
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-wide">
                  {t.name}
                </p>
                <p className="text-[10px] text-muted tracking-wider">
                  {t.role}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
