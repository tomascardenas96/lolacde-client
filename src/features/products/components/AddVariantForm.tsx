"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useAddVariantForm } from "../hooks/useAddVariantForm";
import type { ProductVariant } from "../types/state.types";

interface AddVariantFormProps {
  productId: string;
  onAdded?: (variant: ProductVariant) => void;
  onCancel?: () => void;
}

export const AddVariantForm = ({
  productId,
  onAdded,
  onCancel,
}: AddVariantFormProps) => {
  const {
    form,
    attributesArray,
    addAttribute,
    serverError,
    isLoading,
    onSubmit,
    reset,
  } = useAddVariantForm({
    productId,
    onAdded,
  });

  const {
    register,
    formState: { errors },
  } = form;

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className="p-4 bg-card-light/40 rounded-sm border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
          Nueva variante
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="125.50"
            {...register("price", { valueAsNumber: true })}
            className={`w-full bg-card text-sm text-white px-3 py-2.5 rounded-sm outline-none border ${
              errors.price
                ? "border-red-500/70"
                : "border-transparent focus:border-white/20"
            }`}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
            Stock
          </label>
          <input
            type="number"
            step="1"
            min="0"
            placeholder="50"
            {...register("stock", { valueAsNumber: true })}
            className={`w-full bg-card text-sm text-white px-3 py-2.5 rounded-sm outline-none border ${
              errors.stock
                ? "border-red-500/70"
                : "border-transparent focus:border-white/20"
            }`}
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-400">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
            Atributos
          </span>
          <button
            type="button"
            onClick={addAttribute}
            className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-muted hover:text-white transition-colors cursor-pointer"
          >
            <Plus size={12} /> Atributo
          </button>
        </div>

        {errors.attributes?.root?.message && (
          <p className="text-xs text-red-400">
            {errors.attributes.root.message}
          </p>
        )}
        {errors.attributes?.message && !errors.attributes.root && (
          <p className="text-xs text-red-400">{errors.attributes.message}</p>
        )}

        {attributesArray.fields.length === 0 ? (
          <p className="text-[11px] text-muted italic py-1">
            Sin atributos. Agregá uno si esta variante difiere por color, talle,
            etc.
          </p>
        ) : (
          <div className="space-y-2">
            {attributesArray.fields.map((attr, attrIndex) => {
              const attrErrors = errors.attributes?.[attrIndex];
              return (
                <div key={attr.id} className="flex gap-2">
                  <input
                    placeholder="Clave (ej. color)"
                    {...register(`attributes.${attrIndex}.key`)}
                    className={`flex-1 bg-card text-sm text-white px-3 py-2 rounded-sm outline-none border ${
                      attrErrors?.key
                        ? "border-red-500/70"
                        : "border-transparent focus:border-white/20"
                    }`}
                  />
                  <input
                    placeholder="Valor (ej. Negro)"
                    {...register(`attributes.${attrIndex}.value`)}
                    className={`flex-1 bg-card text-sm text-white px-3 py-2 rounded-sm outline-none border ${
                      attrErrors?.value
                        ? "border-red-500/70"
                        : "border-transparent focus:border-white/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => attributesArray.remove(attrIndex)}
                    className="px-2 text-muted hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Eliminar atributo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {serverError && (
        <p className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm">
          {serverError}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="px-4 py-2 text-[11px] tracking-[0.15em] uppercase text-muted hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-4 py-2 bg-white text-black text-[11px] tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Creando
            </>
          ) : (
            "Crear variante"
          )}
        </button>
      </div>
    </div>
  );
};
