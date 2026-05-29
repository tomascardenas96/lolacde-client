"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[50vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />
        <div className="relative z-10 px-6 md:px-20 lg:px-32 pb-16 w-full">
          <p className="text-[10px] tracking-[0.35em] text-accent mb-4 uppercase">
            Contacto
          </p>
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            HABLEMOS.
          </h1>
          <p className="text-sm md:text-base text-muted max-w-md leading-relaxed">
            Reservá tu turno, hacé una consulta o simplemente pasá a conocernos.
            Estamos para vos.
          </p>
        </div>
      </section>

      {/* Info Strip */}
      <section className="px-6 md:px-20 lg:px-32 -mt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: MapPin,
              title: "Visitanos",
              detail: "Av. Santa Fe 1234, Piso 2",
              sub: "Palermo, CABA",
            },
            {
              icon: Phone,
              title: "Llamanos",
              detail: "+54 11 4567-8900",
              sub: "Lun a Sáb, 9 a 20hs",
            },
            {
              icon: Mail,
              title: "Escribinos",
              detail: "hola@lola.com.ar",
              sub: "Respondemos en 24hs",
            },
            {
              icon: Clock,
              title: "Horarios",
              detail: "Lun a Vie: 9:00 - 20:00",
              sub: "Sábados: 9:00 - 14:00",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`group py-8 px-6 flex items-start gap-4 border-b border-white/5 transition-colors hover:bg-card/50 ${
                i < 3 ? "lg:border-r" : ""
              }`}
            >
              <div className="w-9 h-9 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
                <item.icon className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-[0.65rem] tracking-[0.2em] text-white uppercase font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.detail}
                </p>
                <p className="text-xs text-muted/60 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-6 md:px-20 lg:px-32 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          {/* Form */}
          <div className="lg:col-span-3 bg-card p-8 md:p-14">
            <div className="flex items-start justify-between mb-12">
              <div>
                <p className="text-[10px] tracking-[0.35em] text-accent mb-3 uppercase">
                  Formulario
                </p>
                <h2 className="heading-display text-3xl md:text-4xl text-white">
                  ENVIANOS UN
                  <br />
                  MENSAJE.
                </h2>
              </div>
              <Send className="w-5 h-5 text-muted/30 mt-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="group">
                  <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/20"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3 group-focus-within:text-white transition-colors">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={3}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white outline-none focus:border-white/40 transition-colors resize-none placeholder:text-muted/20"
                  placeholder="Contanos en qué podemos ayudarte..."
                />
              </div>

              <button
                type="submit"
                className={`group/btn flex items-center justify-center gap-3 w-full py-5 text-[0.65rem] tracking-[0.2em] uppercase font-semibold transition-all duration-500 cursor-pointer ${
                  submitted
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-white text-black hover:bg-foreground"
                }`}
              >
                {submitted ? "Mensaje enviado correctamente" : "Enviar mensaje"}
                <ArrowUpRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    submitted
                      ? ""
                      : "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  }`}
                />
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 relative min-h-[350px] lg:min-h-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895467!2d-58.40185032346898!3d-34.60373887295424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca8f0c44e56d%3A0x3fa026e68ccdd82e!2sAv.%20Santa%20Fe%201234%2C%20C1059ABT%20CABA!5e0!3m2!1ses-419!2sar!4v1700000000000!5m2!1ses-419!2sar"
              className="absolute inset-0 w-full h-full border-0 grayscale invert opacity-80"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de LOLA"
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 md:px-20 lg:px-32 pb-24">
        <div className="border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div>
              <p className="text-[10px] tracking-[0.35em] text-accent mb-3 uppercase">
                Redes
              </p>
              <a
                href="#"
                className="group flex items-center gap-2 text-white hover:text-muted transition-colors"
              >
                <span className="text-sm tracking-[0.05em]">
                  @lola.estetica
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.35em] text-accent mb-3 uppercase">
                WhatsApp
              </p>
              <a
                href="https://wa.me/542281576513"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white hover:text-muted transition-colors"
              >
                <span className="text-sm tracking-[0.05em]">
                  +54 2281 576513
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.35em] text-accent mb-3 uppercase">
                Turnos
              </p>
              <a
                href="https://wa.me/542281576513"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-white/20 px-8 py-3 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
              >
                Reservar turno
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
