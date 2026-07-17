"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getApiErrorMessage } from "@/lib/error-utils";
import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/store/authStore";

type Status = "loading" | "success" | "error";

function ConfirmEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      if (!token) {
        setStatus("error");
        setMessage("El enlace de confirmación no es válido.");
        return;
      }
      try {
        await authService.confirmEmail(token);
        setStatus("success");
        setMessage("¡Tu correo fue confirmado correctamente!");
        // Refrescar la sesión para reflejar isEmailConfirmed si está logueado.
        if (isAuthenticated) {
          await authService.getMe();
        }
      } catch (error: unknown) {
        const msg = getApiErrorMessage(
          error,
          "No se pudo confirmar el correo. El enlace puede haber expirado.",
        );
        setStatus("error");
        setMessage(msg);
      }
    })();
  }, [token, isAuthenticated]);

  return (
    <div className="w-full max-w-md text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-10 h-10 text-muted animate-spin mx-auto mb-6" />
          <p className="text-sm text-muted tracking-widest uppercase">
            Confirmando tu correo...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-6" />
          <h1 className="heading-display text-3xl text-white mb-4">
            CORREO CONFIRMADO
          </h1>
          <p className="text-sm text-muted mb-8">{message}</p>
          <Link
            href="/"
            className="inline-block bg-white text-black px-8 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-accent transition-colors"
          >
            Ir al inicio
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
          <h1 className="heading-display text-3xl text-white mb-4">
            NO SE PUDO CONFIRMAR
          </h1>
          <p className="text-sm text-muted mb-8">{message}</p>
          <Link
            href="/"
            className="inline-block border border-white/20 px-8 py-3.5 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
          >
            Volver al inicio
          </Link>
        </>
      )}
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 pt-28 pb-20">
      <Suspense
        fallback={
          <Loader2 className="w-10 h-10 text-muted animate-spin" />
        }
      >
        <ConfirmEmailInner />
      </Suspense>
    </main>
  );
}
