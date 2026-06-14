"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("DASHBOARD_ERROR", error.message, error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-[0.65rem] tracking-[0.25em] text-accent uppercase mb-4">
        Error en el panel
      </p>
      <h2 className="text-2xl text-white font-light mb-3">
        No se pudieron cargar los datos
      </h2>
      <p className="text-sm text-muted max-w-md leading-relaxed mb-8">
        Ocurrió un error al obtener la información. Reintentá o volvé al
        resumen.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm cursor-pointer"
        >
          Reintentar
        </button>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 border border-white/20 text-white text-xs tracking-[0.15em] uppercase hover:bg-white/5 transition-colors rounded-sm"
        >
          Ir al resumen
        </Link>
      </div>
    </div>
  );
}
