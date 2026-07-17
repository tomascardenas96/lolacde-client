"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { categoriesService } from "@/features/categories/services/categoriesService";
import { Category } from "@/features/categories/types/state.types";
import { useToast } from "@/components/ui/Toast";
import { useEditProductForm } from "../hooks/useEditProductForm";
import { VariantForm } from "./VariantForm";
import { VariantRow } from "./VariantRow";
import type { ProductVariant } from "../types/state.types";

interface EditProductFormProps {
  productId: string;
}

export const EditProductForm = ({ productId }: EditProductFormProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const didSyncCategory = useRef(false);

  const {
    form,
    product,
    isLoadingProduct,
    loadError,
    serverError,
    isLoading,
    onSubmit,
    appendVariant,
    replaceVariant,
    removeVariant,
  } = useEditProductForm({
    productId,
    onUpdated: (updated) => {
      showToast(`${updated.name} actualizado`);
      router.push("/dashboard/inventory");
    },
  });

  const {
    register,
    setValue,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await categoriesService.getCategories();
        if (active) setCategories(list);
      } catch (err: unknown) {
        const msg = getApiErrorMessage(
          err,
          "No se pudieron cargar las categorías",
        );
        if (active) setCategoriesError(msg);
        logger.error("EDIT_PRODUCT_FORM", "Fallo al obtener categorías", err);
      } finally {
        if (active) setLoadingCategories(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Resync the category once both product and category list are ready —
  // the <select> only honours a value if a matching <option> is mounted.
  useEffect(() => {
    if (didSyncCategory.current) return;
    if (loadingCategories || !product) return;
    const id = product.category?.id ?? "";
    setValue("categoryId", id, { shouldDirty: false, shouldValidate: false });
    didSyncCategory.current = true;
  }, [loadingCategories, product, setValue]);

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-muted animate-spin" />
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="max-w-3xl">
        <div className="p-5 bg-card rounded-sm">
          <p className="text-sm text-danger mb-4">
            {loadError ?? "No se pudo cargar el producto"}
          </p>
          <Link
            href="/dashboard/inventory"
            className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-muted hover:text-white uppercase transition-colors"
          >
            <ArrowLeft size={14} />
            Volver al inventario
          </Link>
        </div>
      </div>
    );
  }

  const handleVariantAdded = (variant: ProductVariant) => {
    appendVariant(variant);
    setShowAddVariant(false);
    showToast("Variante creada");
  };

  const canDeleteVariant = product.variants.length > 1;

  return (
    <div className="space-y-6 max-w-3xl">
      <form onSubmit={onSubmit} className="space-y-6">
        <section className="p-5 bg-card rounded-sm space-y-4">
          <h2 className="text-[11px] tracking-[0.2em] text-muted uppercase">
            Datos del producto
          </h2>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
              Nombre
            </label>
            <input
              placeholder="Zapatillas Nike Air"
              {...register("name")}
              className={`w-full bg-card-light text-sm text-white px-3 py-2.5 rounded-sm outline-none border ${
                errors.name
                  ? "border-red-500/70"
                  : "border-transparent focus:border-white/20"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
              Descripción
            </label>
            <textarea
              rows={4}
              placeholder="Calzado deportivo de alto rendimiento"
              {...register("description")}
              className={`w-full bg-card-light text-sm text-white px-3 py-2.5 rounded-sm outline-none border resize-y ${
                errors.description
                  ? "border-red-500/70"
                  : "border-transparent focus:border-white/20"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2">
                Categoría
              </label>
              <select
                {...register("categoryId")}
                disabled={loadingCategories || !!categoriesError}
                className={`w-full bg-card-light text-sm text-white px-3 py-2.5 rounded-sm outline-none border appearance-none cursor-pointer disabled:opacity-60 ${
                  errors.categoryId
                    ? "border-red-500/70"
                    : "border-transparent focus:border-white/20"
                }`}
              >
                <option value="">
                  {loadingCategories
                    ? "Cargando categorías..."
                    : "Seleccionar categoría"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <p className="mt-1 text-xs text-red-400">{categoriesError}</p>
              )}
              {errors.categoryId && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 px-3 py-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="accent-accent w-4 h-4"
                />
                <span className="text-xs tracking-[0.15em] uppercase text-muted">
                  Activo
                </span>
              </label>
            </div>
          </div>
        </section>

        {serverError && (
          <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-sm">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/inventory")}
            disabled={isLoading}
            className="px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-muted hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || !isDirty}
            className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Guardando
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>

      <section className="p-5 bg-card rounded-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] tracking-[0.2em] text-muted uppercase">
            Variantes · {product.variants.length}
          </h2>
          <button
            type="button"
            onClick={() => setShowAddVariant((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-[0.15em] uppercase bg-card-light text-white hover:bg-white/10 transition-colors rounded-sm cursor-pointer"
          >
            <Plus
              size={14}
              className={`transition-transform duration-300 ${
                showAddVariant ? "rotate-45" : ""
              }`}
            />
            {showAddVariant ? "Cerrar" : "Variante"}
          </button>
        </div>

        {product.variants.length === 0 ? (
          <p className="text-xs text-muted italic py-2">
            Este producto aún no tiene variantes.
          </p>
        ) : (
          <div className="space-y-2">
            {product.variants.map((variant) => (
              <VariantRow
                key={variant.id}
                productId={productId}
                variant={variant}
                canDelete={canDeleteVariant}
                onUpdated={replaceVariant}
                onDeleted={removeVariant}
              />
            ))}
          </div>
        )}

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            showAddVariant ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="pt-2">
              <VariantForm
                productId={productId}
                onSuccess={handleVariantAdded}
                onCancel={() => setShowAddVariant(false)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
