"use client";

import Link from "next/link";
import { useLoginForm } from "../hooks/useLoginForm";
import { Input } from "../ui/Input";

export const LoginForm = () => {
  const { form, onSubmit, isLoading, serverError } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h1 className={`text-[2rem] font-bold mb-6`}>Iniciar Sesión </h1>

      <Input
        label="Email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        trailing={
          <Link
            href="/forgot-password"
            className="text-[10px] tracking-[0.15em] text-muted hover:text-white transition-colors uppercase"
          >
            ¿Olvidáste tu contraseña?
          </Link>
        }
        {...register("password")}
      />

      {serverError && (
        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 bg-white text-black text-xs tracking-[0.2em] font-medium uppercase hover:bg-white/90 transition-colors disabled:opacity-50 mt-4"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
};
