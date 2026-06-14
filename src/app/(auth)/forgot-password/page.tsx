"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { authService } from "@/features/auth/services/authService";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas/password.schema";
import { Input } from "@/features/auth/ui/Input";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null);
    try {
      await authService.forgotPassword(values.email);
      setSent(true);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "No se pudo enviar el correo"
          : "No se pudo enviar el correo";
      setServerError(msg);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[2rem] font-bold mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-muted mb-8">
          Ingresá tu email y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>

        {sent ? (
          <div className="p-4 text-sm text-white bg-white/5 border border-white/10 rounded">
            Si el email está registrado, vas a recibir un enlace para
            restablecer tu contraseña. Revisá tu bandeja de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            {serverError && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white text-black text-xs tracking-[0.2em] font-medium uppercase hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-muted">
          <Link
            href="/login"
            className="text-white underline underline-offset-4 hover:text-muted transition-colors"
          >
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
