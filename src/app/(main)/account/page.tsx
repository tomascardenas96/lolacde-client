"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/lib/error-utils";
import {
  CheckCircle2,
  ChevronRight,
  Heart,
  Loader2,
  MapPin,
  Mail,
  Package,
  ShieldAlert,
} from "lucide-react";
import { Badge, Button, Input, Modal } from "@/components/ui";
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
        <AccountHeader />
        <section className="px-6 md:px-20 lg:px-32">
          <div className="border border-white/8 bg-surface-1 text-center py-20 px-6 animate-fade-in-up">
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

/* ── Editorial header with champagne glow ─────────────────────── */
function AccountHeader({ subtitle }: { subtitle?: string | null }) {
  return (
    <section className="relative px-6 md:px-20 lg:px-32 mb-14 md:mb-20">
      <div className="glow-accent pointer-events-none absolute inset-x-6 md:inset-x-20 lg:inset-x-32 -top-24 h-80" />
      <div className="relative">
        <p className="eyebrow mb-5 animate-fade-in">Tu espacio personal</p>
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white animate-fade-in-up">
          MI <br /> CUENTA
        </h1>
        {subtitle && (
          <p className="mt-5 text-[0.65rem] tracking-[0.15em] text-muted uppercase animate-fade-in-up">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Numbered editorial section wrapper ───────────────────────── */
function SettingsSection({
  index,
  title,
  children,
  delay = 0,
}: {
  index: string;
  title: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="group relative animate-fade-in-up border border-white/8 bg-surface-1 p-8 md:p-10 transition-colors duration-300 hover:border-white/15"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* champagne hairline reveal on the left edge */}
      <span className="absolute left-0 top-0 h-full w-px bg-accent/0 group-hover:bg-accent/40 transition-colors duration-300" />
      <header className="flex items-center gap-5 mb-8">
        <span className="heading-display text-xl leading-none text-accent">
          {index}
        </span>
        <h2 className="text-[0.7rem] tracking-[0.25em] uppercase font-semibold text-white whitespace-nowrap">
          {title}
        </h2>
        <span className="h-px flex-1 bg-white/8" />
      </header>
      {children}
    </section>
  );
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
      showToast(getApiErrorMessage(error, "No se pudo actualizar el perfil"));
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
      showToast(getApiErrorMessage(error, "No se pudo cambiar la contraseña"));
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.sendConfirmationMail(user.email);
      showToast("Te reenviamos el correo de confirmación");
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error, "No se pudo reenviar el correo"));
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
      showToast(getApiErrorMessage(error, "No se pudo eliminar la cuenta"));
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
      })
    : null;

  const birthDate = user.birthdate
    ? new Date(user.birthdate).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const initials =
    `${user.name?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() || "?";

  const roleLabel =
    user.role?.name?.toLowerCase() === "admin" ? "Administrador" : "Cliente";

  const quickLinks = [
    { href: "/orders", label: "Mis pedidos", icon: Package },
    { href: "/favorites", label: "Favoritos", icon: Heart },
    { href: "/addresses", label: "Mis direcciones", icon: MapPin },
  ];

  return (
    <main className="min-h-screen bg-background pt-28 pb-24">
      <AccountHeader subtitle={memberSince ? `Miembro desde ${memberSince}` : null} />

      <section className="px-6 md:px-20 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* ── Identity panel (sticky) ───────────────────────── */}
          <aside className="lg:col-span-4 animate-fade-in-up">
            <div className="lg:sticky lg:top-28 relative overflow-hidden border border-white/8 bg-surface-1 p-8">
              <div className="glow-accent pointer-events-none absolute -top-16 -right-16 w-48 h-48 opacity-70" />
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xl font-medium uppercase tracking-[0.15em] text-accent mb-6">
                  {initials}
                </div>
                <h2 className="heading-display text-2xl md:text-3xl text-white leading-none mb-2">
                  {user.name} {user.lastname}
                </h2>
                <p className="text-sm text-muted break-all mb-5">{user.email}</p>

                <div className="flex flex-wrap gap-2 mb-7">
                  <Badge variant="outline" size="sm">
                    {roleLabel}
                  </Badge>
                  {user.isEmailConfirmed ? (
                    <Badge variant="success" size="sm" dot>
                      Email verificado
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm" dot>
                      Sin verificar
                    </Badge>
                  )}
                </div>

                <dl className="space-y-3 py-6 border-t border-white/8">
                  {memberSince && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="label-caps">Miembro desde</dt>
                      <dd className="text-xs text-text-secondary capitalize">
                        {memberSince}
                      </dd>
                    </div>
                  )}
                  {birthDate && (
                    <div className="flex items-center justify-between gap-4">
                      <dt className="label-caps">Nacimiento</dt>
                      <dd className="text-xs text-text-secondary">{birthDate}</dd>
                    </div>
                  )}
                </dl>

                <nav className="space-y-px border-t border-white/8 pt-6">
                  {quickLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center justify-between -mx-2 px-2 py-3 transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                        <span className="text-xs tracking-[0.08em] text-text-secondary group-hover:text-white transition-colors">
                          {label}
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* ── Settings sections ─────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* 01 — Datos personales */}
            <SettingsSection index="01" title="Datos personales" delay={60}>
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
                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="outline"
                    loading={profileForm.formState.isSubmitting}
                    disabled={!profileForm.formState.isDirty}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </SettingsSection>

            {/* 02 — Correo electrónico */}
            <SettingsSection index="02" title="Correo electrónico" delay={120}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-3">
                  {user.isEmailConfirmed ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <Mail className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-white break-all">{user.email}</p>
                    <p
                      className={`mt-1 text-xs ${
                        user.isEmailConfirmed ? "text-success" : "text-warning"
                      }`}
                    >
                      {user.isEmailConfirmed
                        ? "Tu correo está confirmado"
                        : "Tu correo todavía no está confirmado"}
                    </p>
                  </div>
                </div>
                {!user.isEmailConfirmed && (
                  <Button
                    variant="outline"
                    size="sm"
                    loading={resending}
                    onClick={handleResend}
                  >
                    Reenviar confirmación
                  </Button>
                )}
              </div>
            </SettingsSection>

            {/* 03 — Seguridad */}
            <SettingsSection index="03" title="Seguridad" delay={180}>
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
                <div className="pt-1">
                  <Button
                    type="submit"
                    variant="outline"
                    loading={passwordForm.formState.isSubmitting}
                  >
                    Actualizar contraseña
                  </Button>
                </div>
              </form>
            </SettingsSection>

            {/* Danger zone */}
            <section
              className="relative overflow-hidden border border-danger/20 bg-danger/[0.03] p-8 md:p-10 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <header className="flex items-center gap-5 mb-6">
                <ShieldAlert className="w-5 h-5 text-danger/80 shrink-0" />
                <h2 className="text-[0.7rem] tracking-[0.25em] uppercase font-semibold text-danger whitespace-nowrap">
                  Zona de riesgo
                </h2>
                <span className="h-px flex-1 bg-danger/15" />
              </header>
              <p className="text-sm text-muted mb-6 max-w-md leading-relaxed">
                Al eliminar tu cuenta perderás el acceso a tus pedidos, favoritos
                y direcciones guardadas. Esta acción no se puede deshacer.
              </p>
              <Button variant="danger" onClick={() => setDeleteOpen(true)}>
                Eliminar mi cuenta
              </Button>
            </section>
          </div>
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
