"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { authService } from "@/features/auth/services/authService";
import { useToast } from "@/components/ui/Toast";

/**
 * Banner persistente que invita a confirmar el email cuando el usuario
 * autenticado todavía no lo verificó. Permite reenviar el correo.
 */
export function EmailConfirmationBanner() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { showToast } = useToast();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isAuthenticated || !user || user.isEmailConfirmed || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setSending(true);
    try {
      await authService.sendConfirmationMail(user.email);
      showToast("Te reenviamos el correo de confirmación");
    } catch {
      showToast("No se pudo reenviar el correo");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-card border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-accent shrink-0" />
          <p className="text-xs text-white/90">
            Confirmá tu correo para asegurar tu cuenta.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="text-[0.6rem] tracking-[0.15em] uppercase font-semibold text-black bg-white px-4 py-2 hover:bg-accent transition-colors cursor-pointer disabled:opacity-50"
        >
          {sending ? "Enviando..." : "Reenviar correo"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Cerrar"
          className="text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
