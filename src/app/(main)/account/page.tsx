"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CheckCircle2, ChevronRight, Loader2, MapPin, Mail } from "lucide-react";
import { Button, Input, Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/features/auth/store/authStore";
import { authService } from "@/features/auth/services/authService";
import { userService } from "@/features/user/services/userService";
import {
  profileSchema,
  type ProfileValues,
} from "@/features/user/schemas/profile.schema";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/features/auth/schemas/password.schema";

const apiMessage = (error: unknown, fallback: string) =>
  error instanceof AxiosError
    ? error.response?.data?.message || fallback
    : fallback;

export default function AccountPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isChecking = useAuthStore((s) => s.isChecking);
  const user = useAuthStore((s) => s.user);

  if (isChecking) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-muted animate-spin" />
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-background pt-28 pb-20">
        <section className="px-6 md:px-20 lg:px-32 mb-12">
          <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
            MI <br /> CUENTA
          </h1>
        </section>
        <section className="px-6 md:px-20 lg:px-32">
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Iniciá sesión para gestionar tu cuenta
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesión
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <AccountContent />;
}

function AccountContent() {
  const user = useAuthStore((s) => s.user)!;
  const { showToast } = useToast();

  const [resending, setResending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // --- Perfil (nombre / apellido) ---
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user.name ?? "", lastname: user.lastname ?? "" },
  });

  const onSaveProfile = async (data: ProfileValues) => {
    try {
      await userService.updateProfile({
        name: data.name,
        lastname: data.lastname || undefined,
      });
      await authService.getMe();
      showToast("Perfil actualizado");
    } catch (error: unknown) {
      showToast(apiMessage(error, "No se pudo actualizar el perfil"));
    }
  };

  // --- Cambio de contraseña ---
  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onChangePassword = async (data: ChangePasswordValues) => {
    try {
      await authService.changePassword(data);
      showToast("Contraseña actualizada");
      passwordForm.reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      showToast(apiMessage(error, "No se pudo cambiar la contraseña"));
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.sendConfirmationMail(user.email);
      showToast("Te reenviamos el correo de confirmación");
    } catch (error: unknown) {
      showToast(apiMessage(error, "No se pudo reenviar el correo"));
    } finally {
      setResending(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userService.deleteAccount();
      // logout() limpia la sesión y redirige a /login.
      await authService.logout();
    } catch (error: unknown) {
      setDeleting(false);
      setDeleteOpen(false);
      showToast(apiMessage(error, "No se pudo eliminar la cuenta"));
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          MI <br /> CUENTA
        </h1>
        {memberSince && (
          <p className="text-[0.65rem] tracking-[0.15em] text-muted uppercase">
            Miembro desde {memberSince}
          </p>
        )}
      </section>

      <section className="px-6 md:px-20 lg:px-32 max-w-3xl space-y-px">
        {/* Datos personales */}
        <div className="bg-card p-8">
          <h2 className="text-[0.7rem] tracking-[0.2em] text-white uppercase font-semibold mb-6">
            Datos personales
          </h2>
          <form
            onSubmit={profileForm.handleSubmit(onSaveProfile)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nombre"
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register("name")}
              />
              <Input
                label="Apellido"
                error={profileForm.formState.errors.lastname?.message}
                {...profileForm.register("lastname")}
              />
            </div>
            <Input label="Email" defaultValue={user.email} disabled />
            <Button
              type="submit"
              variant="outline"
              loading={profileForm.formState.isSubmitting}
              disabled={!profileForm.formState.isDirty}
            >
              Guardar cambios
            </Button>
          </form>
        </div>

        {/* Estado del email */}
        <div className="bg-card p-8">
          <h2 className="text-[0.7rem] tracking-[0.2em] text-white uppercase font-semibold mb-6">
            Correo electrónico
          </h2>
          {user.isEmailConfirmed ? (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              Tu correo está confirmado
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Mail className="w-4 h-4" />
                Tu correo todavía no está confirmado
              </div>
              <Button
                variant="outline"
                size="sm"
                loading={resending}
                onClick={handleResend}
              >
                Reenviar confirmación
              </Button>
            </div>
          )}
        </div>

        {/* Cambio de contraseña */}
        <div className="bg-card p-8">
          <h2 className="text-[0.7rem] tracking-[0.2em] text-white uppercase font-semibold mb-6">
            Cambiar contraseña
          </h2>
          <form
            onSubmit={passwordForm.handleSubmit(onChangePassword)}
            className="space-y-5"
          >
            <Input
              label="Contraseña actual"
              type="password"
              error={passwordForm.formState.errors.oldPassword?.message}
              {...passwordForm.register("oldPassword")}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Nueva contraseña"
                type="password"
                error={passwordForm.formState.errors.newPassword?.message}
                {...passwordForm.register("newPassword")}
              />
              <Input
                label="Repetir nueva contraseña"
                type="password"
                error={passwordForm.formState.errors.confirmPassword?.message}
                {...passwordForm.register("confirmPassword")}
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              loading={passwordForm.formState.isSubmitting}
            >
              Actualizar contraseña
            </Button>
          </form>
        </div>

        {/* Direcciones */}
        <Link
          href="/addresses"
          className="bg-card p-8 flex items-center justify-between group hover:bg-surface-3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted" />
            <span className="text-sm text-white tracking-[0.05em]">
              Gestionar mis direcciones
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-white transition-colors" />
        </Link>

        {/* Eliminar cuenta */}
        <div className="bg-card p-8">
          <h2 className="text-[0.7rem] tracking-[0.2em] text-danger uppercase font-semibold mb-3">
            Eliminar cuenta
          </h2>
          <p className="text-sm text-muted mb-6 max-w-md">
            Al eliminar tu cuenta perderás el acceso a tus pedidos, favoritos y
            direcciones guardadas. Esta acción no se puede deshacer.
          </p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Eliminar mi cuenta
          </Button>
        </div>
      </section>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        eyebrow="Eliminar"
        title="Eliminar cuenta"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          ¿Seguro que querés eliminar tu cuenta? Vas a cerrar sesión y no podrás
          deshacer esta acción.
        </p>
      </Modal>
    </main>
  );
}
