"use client";

import { MessageCircleWarningIcon } from "lucide-react";
import { useState } from "react";
import Logo from "../layout/Logo";

const SERVICE_LABELS: Record<string, string> = {
  "1": "Servicio 1",
  "2": "Servicio 2",
  "3": "Servicio 3",
};

export function MembershipSection() {
  const [name, setName] = useState("");
  const [service, setService] = useState("");

  const whatsappMessage = `Hola! Soy ${name}, quiero reservar un turno para ${SERVICE_LABELS[service] ?? ""}.`;
  const whatsappUrl = `https://wa.me/542281576513?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="px-6 md:px-24 py-32 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        {/* Card mockup */}
        <div className="relative flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-white border-3 border-accent grid items-center justify-center pb-6  ">
            <Logo color="dark" size="large" />
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-[10px] tracking-[0.35em] text-accent mb-4 uppercase">
            RESERVÁ UN TURNO
          </p>
          <h2 className="heading-display text-4xl md:text-5xl text-white mb-6">
            RESERVÁ UN TURNO
          </h2>
          <p className="text-sm text-muted leading-relaxed max-w-md">
            Elegí el servicio que deseas y encontrá el momento perfecto para
            vos. Seleccioná el servicio deseado de la lista y reservá un turno.
          </p>
          <p className="text-sm text-accent leading-relaxed max-w-md flex items-center gap-2">
            <MessageCircleWarningIcon className="inline-block w-5" /> Turnos
            solo disponibles para Benito Juarez, Argentina.
          </p>

          {/* Formulario de reserva */}
          <form className="mt-10 space-y-5">
            <div className="relative">
              <label className="block text-[10px] tracking-[0.3em] text-accent uppercase mb-2">
                Servicio
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-card border border-white/10 rounded-sm px-5 py-4 text-xs tracking-[0.15em] text-white appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Seleccionar servicio</option>
                <option value="1">Servicio 1</option>
                <option value="2">Servicio 2</option>
                <option value="3">Servicio 3</option>
              </select>
              <div className="pointer-events-none absolute right-5 top-[calc(50%+8px)] -translate-y-1/2">
                <svg
                  className="w-3 h-3 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] text-accent uppercase mb-2">
                Nombre
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-card border border-white/10 rounded-sm px-5 py-4 text-xs tracking-[0.15em] text-white placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {name.trim() && service ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-8 bg-accent text-background px-10 py-5 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white transition-colors cursor-pointer text-center"
              >
                Reservar turno
              </a>
            ) : (
              <span className="block w-full mt-8 bg-accent/30 text-muted px-10 py-5 text-xs tracking-[0.25em] uppercase font-medium cursor-not-allowed text-center">
                Completá los campos para reservar
              </span>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
