"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Loader2, Pencil, SlidersHorizontal, Trash2 } from "lucide-react";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { useToast } from "@/components/ui/Toast";
import { StockAdjustmentModal } from "@/features/inventory/components/StockAdjustmentModal";
import type { CreateAdjustmentResponse } from "@/features/inventory/types/state.types";
import { productsService } from "../services/productsService";
import { VariantForm } from "./VariantForm";
import type { ProductVariant } from "../types/state.types";

interface VariantRowProps {
  productId: string;
  variant: ProductVariant;
  /** Si es false, deshabilita la eliminación (p. ej. última variante). */
  canDelete: boolean;
  onUpdated: (variant: ProductVariant) => void;
  onDeleted: (variantId: string) => void;
}

const parsePrice = (price: string | number) =>
  typeof price === "number" ? price : Number(price) || 0;

export const VariantRow = ({
  productId,
  variant,
  canDelete,
  onUpdated,
  onDeleted,
}: VariantRowProps) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const stock = variant.stock ?? 0;

  const handleUpdated = (updated: ProductVariant) => {
    onUpdated(updated);
    setIsEditing(false);
    showToast("Variante actualizada");
  };

  /**
   * El saldo nuevo se toma de `balanceAfter` del movimiento, que es lo que
   * quedó anotado en el kardex. `null` significa que la variante no controla
   * stock: no hubo movimiento y tampoco es un error.
   */
  const handleAdjusted = (movement: CreateAdjustmentResponse) => {
    if (!movement) {
      showToast("Esta variante no controla stock");
      return;
    }
    onUpdated({ ...variant, stock: movement.balanceAfter });
    showToast("Ajuste registrado en el kardex");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await productsService.deleteVariant(productId, variant.id);
      onDeleted(variant.id);
      showToast("Variante eliminada");
    } catch (err: unknown) {
      const status =
        err instanceof AxiosError ? err.response?.status : undefined;
      const fallback =
        status === 400
          ? "No se puede eliminar la única variante del producto"
          : "No se pudo eliminar la variante";
      const msg = getApiErrorMessage(err, fallback);
      setDeleteError(msg);
      logger.error("VARIANT_ROW", "Fallo al eliminar variante", err);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <VariantForm
        productId={productId}
        variant={variant}
        onSuccess={handleUpdated}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="py-3 px-4 bg-card-light/40 rounded-sm border border-white/5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="font-mono text-xs text-white/90 min-w-[140px]">
          {variant.sku}
        </span>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {variant.attributes &&
          Object.keys(variant.attributes).length > 0 ? (
            Object.entries(variant.attributes).map(([key, value]) => (
              <span
                key={key}
                className="inline-block px-2 py-0.5 bg-card rounded-sm text-[0.65rem] tracking-[0.05em] text-white/70 uppercase"
              >
                {key}: {value}
              </span>
            ))
          ) : (
            <span className="text-[0.65rem] text-muted italic">
              Sin atributos
            </span>
          )}
        </div>
        <div className="flex items-center gap-6 text-xs">
          <span className="text-white/80">
            ${parsePrice(variant.price).toLocaleString("en-US")}
          </span>
          <span
            className={`tracking-[0.1em] uppercase text-[0.65rem] ${
              stock === 0
                ? "text-danger"
                : stock <= 3
                  ? "text-warning"
                  : "text-muted"
            }`}
          >
            {stock} en stock
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsAdjusting(true)}
            title="Ajustar stock"
            className="p-1.5 text-muted hover:text-white transition-colors cursor-pointer"
            aria-label="Ajustar stock"
          >
            <SlidersHorizontal size={14} />
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-muted hover:text-white transition-colors cursor-pointer"
            aria-label="Editar variante"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmingDelete(true);
              setDeleteError(null);
            }}
            disabled={!canDelete}
            title={
              canDelete
                ? "Eliminar variante"
                : "No se puede eliminar la única variante"
            }
            className="p-1.5 text-muted hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-muted"
            aria-label="Eliminar variante"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {confirmingDelete && (
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-muted">
            ¿Eliminar esta variante? Esta acción no se puede deshacer.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-[11px] tracking-[0.15em] uppercase text-muted hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 bg-red-500/90 text-white text-[11px] tracking-[0.15em] uppercase hover:bg-red-500 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Eliminando
                </>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      )}

      {deleteError && (
        <p className="mt-2 text-xs text-red-400">{deleteError}</p>
      )}

      <StockAdjustmentModal
        open={isAdjusting}
        onClose={() => setIsAdjusting(false)}
        variantId={variant.id}
        variantSku={variant.sku}
        currentStock={stock}
        onAdjusted={handleAdjusted}
      />
    </div>
  );
};
