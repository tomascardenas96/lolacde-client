"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MapPin, Plus } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAddressesStore } from "@/features/addresses/store/addressesStore";
import { addressesService } from "@/features/addresses/services/addressesService";
import { AddressCard } from "@/features/addresses/components/AddressCard";
import { AddressFormModal } from "@/features/addresses/components/AddressFormModal";
import { Address } from "@/features/addresses/types/state.types";

export default function AddressesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addresses = useAddressesStore((s) => s.addresses);
  const isLoading = useAddressesStore((s) => s.isLoading);
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      addressesService.getAddresses();
    }
  }, [isAuthenticated]);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSetDefault = async (address: Address) => {
    setBusyId(address.id);
    try {
      await addressesService.setDefault(address.id);
      showToast("Dirección predeterminada actualizada");
    } catch {
      showToast("No se pudo actualizar la dirección");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await addressesService.remove(deleteTarget.id);
      showToast("Dirección eliminada");
      setDeleteTarget(null);
    } catch {
      showToast("No se pudo eliminar la dirección");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          MIS <br /> DIRECCIONES
        </h1>
      </section>

      <section className="px-6 md:px-20 lg:px-32">
        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Inicia sesion para gestionar tus direcciones
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesion
            </Link>
          </div>
        ) : isLoading && addresses.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Button
                variant="outline"
                size="sm"
                leading={<Plus className="w-4 h-4" />}
                onClick={openCreate}
              >
                Agregar dirección
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="w-10 h-10 text-muted mx-auto mb-4" />
                <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
                  Aun no tienes direcciones guardadas
                </p>
                <Button variant="outline" onClick={openCreate}>
                  Agregar tu primera dirección
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                    onSetDefault={handleSetDefault}
                    busy={busyId === address.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <AddressFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        address={editing}
        onSuccess={() =>
          showToast(editing ? "Dirección actualizada" : "Dirección agregada")
        }
      />

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        eyebrow="Eliminar"
        title="Eliminar dirección"
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={busyId === deleteTarget?.id}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={busyId === deleteTarget?.id}
            >
              Eliminar
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          ¿Seguro que querés eliminar esta dirección? Esta acción no se puede
          deshacer.
        </p>
        {deleteTarget && (
          <p className="text-sm text-white mt-3">
            {deleteTarget.addressLine}, {deleteTarget.city}
          </p>
        )}
      </Modal>
    </main>
  );
}
