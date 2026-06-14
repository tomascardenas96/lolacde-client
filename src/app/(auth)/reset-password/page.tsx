"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { authService } from "@/features/auth/services/authService";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/features/auth/schemas/password.schema";
import { Input } from "@/features/auth/ui/Input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setServerError(null);
    try {
      await authService.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "No se pudo restablecer la contraseña"
          : "No se pudo restablecer la contraseña";
      setServerError(msg);
    }
  };

  if (!token) {
    return (
      <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded">
        El enlace no es válido o expiró. Solicitá uno nuevo desde{" "}
        <Link href="/forgot-password" className="underline">
          recuperar contraseña
        </Link>
        .
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-4 text-sm text-white bg-white/5 border border-white/10 rounded">
        Tu contraseña fue actualizada. Te redirigimos al inicio de sesión...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Nueva contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
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
        {isSubmitting ? "Guardando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-[2rem] font-bold mb-2">Nueva contraseña</h1>
        <p className="text-sm text-muted mb-8">
          Elegí una contraseña nueva para tu cuenta.
        </p>

        <Suspense
          fallback={
            <p className="text-sm text-muted">Cargando...</p>
          }
        >
          <ResetPasswordForm />
        </Suspense>

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
