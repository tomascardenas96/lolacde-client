"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("APP_ERROR", error.message, error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.65rem] tracking-[0.35em] text-accent uppercase mb-6">
        Algo salio mal
      </p>
      <h1 className="heading-display text-5xl md:text-7xl text-white mb-6">
        UPS.
      </h1>
      <p className="text-sm text-muted max-w-sm leading-relaxed mb-10">
        Ocurrio un error inesperado. Podes reintentar o volver al inicio.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="inline-block bg-white text-black px-10 py-4 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-transparent hover:text-white border border-white transition-all cursor-pointer"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:border-white/50 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
