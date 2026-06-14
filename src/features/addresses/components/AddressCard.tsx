"use client";

import { MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { Address } from "../types/state.types";

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  busy?: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy,
}: Props) {
  return (
    <div
      className={`border p-6 transition-colors ${
        address.isDefault
          ? "border-accent/40 bg-card"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <MapPin
            className="w-4 h-4 text-muted mt-0.5 shrink-0"
            strokeWidth={1.5}
          />
          <div className="min-w-0">
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 text-[0.55rem] tracking-[0.2em] uppercase text-accent border border-accent/30 px-2 py-0.5 mb-2">
                <Star className="w-2.5 h-2.5" fill="currentColor" />
                Predeterminada
              </span>
            )}
            <p className="text-sm text-white">{address.addressLine}</p>
            <p className="text-xs text-muted mt-1">
              {address.city}, {address.state}
              {address.zipCode ? ` (${address.zipCode})` : ""} —{" "}
              {address.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!address.isDefault && (
            <button
              type="button"
              onClick={() => onSetDefault(address)}
              disabled={busy}
              title="Marcar como predeterminada"
              aria-label="Marcar como predeterminada"
              className="w-8 h-8 inline-flex items-center justify-center text-muted hover:text-accent transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Star className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(address)}
            disabled={busy}
            title="Editar"
            aria-label="Editar dirección"
            className="w-8 h-8 inline-flex items-center justify-center text-muted hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={busy}
            title="Eliminar"
            aria-label="Eliminar dirección"
            className="w-8 h-8 inline-flex items-center justify-center text-muted hover:text-danger transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
