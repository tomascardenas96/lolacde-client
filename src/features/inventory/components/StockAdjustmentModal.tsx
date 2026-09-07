"use client";

import { Modal, Input, Textarea, Button, cn } from "@/components/ui";
import { useStockAdjustmentForm } from "../hooks/useStockAdjustmentForm";
import {
  AdjustmentDirection,
  adjustmentDirections,
} from "../schemas/stock-adjustment.schema";
import type { CreateAdjustmentResponse } from "../types/state.types";

interface Props {
  open: boolean;
  onClose: () => void;
  variantId: string;
  variantSku: string;
  currentStock: number;
  onAdjusted: (movement: CreateAdjustmentResponse) => void;
}

const directionLabels: Record<AdjustmentDirection, string> = {
  add: "Agregar",
  remove: "Quitar",
};

export function StockAdjustmentModal({
  open,
  onClose,
  variantId,
  variantSku,
  currentStock,
  onAdjusted,
}: Props) {
  const handleSuccess = (movement: CreateAdjustmentResponse) => {
    onAdjusted(movement);
    onClose();
  };

  const { form, serverError, isLoading, onSubmit, reset } =
    useStockAdjustmentForm({ variantId, onSuccess: handleSuccess });

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const direction = watch("direction");
  const rawQuantity = watch("quantity");
  const quantity = Number.isFinite(rawQuantity) ? rawQuantity : 0;
  const resultingStock =
    currentStock + (direction === "remove" ? -quantity : quantity);
  // Misma regla que aplica el backend: el saldo nunca puede quedar negativo.
  const wouldGoNegative = resultingStock < 0;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      eyebrow="Inventario"
      title="Ajustar stock"
      size="sm"
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={isLoading}
            disabled={wouldGoNegative}
            onClick={onSubmit}
            type="button"
          >
            Registrar ajuste
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
            Variante
          </p>
          <p className="font-mono text-xs text-white/90">{variantSku}</p>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
            Movimiento
          </p>
          <div className="grid grid-cols-2 gap-2">
            {adjustmentDirections.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={direction === value}
                onClick={() =>
                  setValue("direction", value, { shouldValidate: true })
                }
                className={cn(
                  "px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase rounded-sm border transition-colors cursor-pointer",
                  direction === value
                    ? "bg-white text-black border-white"
                    : "border-white/10 text-muted hover:text-white hover:border-white/30",
                )}
              >
                {directionLabels[value]}
              </button>
            ))}
          </div>
        </div>

        <Input
          type="number"
          step="1"
          min="1"
          label="Cantidad"
          placeholder="1"
          error={errors.quantity?.message}
          {...register("quantity", { valueAsNumber: true })}
        />

        <Textarea
          label="Motivo"
          rows={3}
          placeholder="Ej. Conteo físico: faltaban 2 unidades"
          hint="Queda guardado en el kardex junto al movimiento."
          error={errors.reason?.message}
          {...register("reason")}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-card-light/40 border border-white/5 rounded-sm">
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
            Stock resultante
          </span>
          <span className="text-sm">
            <span className="text-muted">{currentStock}</span>
            <span className="text-muted mx-2">&rarr;</span>
            <span className={wouldGoNegative ? "text-danger" : "text-white"}>
              {resultingStock}
            </span>
          </span>
        </div>

        {wouldGoNegative && (
          <p className="text-xs text-danger">
            No se pueden quitar {quantity} unidades: hay {currentStock}.
          </p>
        )}

        {serverError && (
          <p className="text-xs text-danger border border-danger/20 bg-danger/5 px-4 py-3">
            {serverError}
          </p>
        )}
      </div>
    </Modal>
  );
}
