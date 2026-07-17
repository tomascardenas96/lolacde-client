"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { categoriesService } from "@/features/categories/services/categoriesService";
import { Category } from "@/features/categories/types/state.types";
import { useCreateProductForm } from "../hooks/useCreateProductForm";
import { VariantsField } from "./VariantsField";
import { ImagePicker } from "./ImagePicker";

export const CreateProductForm = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    form,
    variantsArray,
    addVariant,
    files,
    setFiles,
    uploadProgress,
    onSubmit,
    isLoading,
    serverError,
  } = useCreateProductForm({
    onCreated: ({ productId }) => {
      logger.info(
        "CREATE_PRODUCT_FORM",
        `Redirigiendo al inventario tras crear ${productId}`,
      );
      router.push("/dashboard/inventory");
    },
  });

  const {
    register,
    control,
    formState: { errors },
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
        logger.error("CREATE_PRODUCT_FORM", "Fallo al obtener categorías", err);
      } finally {
        if (active) setLoadingCategories(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
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

      <section className="p-5 bg-card rounded-sm">
        <VariantsField
          control={control}
          register={register}
          errors={errors}
          variantsArray={variantsArray}
          onAddVariant={addVariant}
        />
      </section>

      <section className="p-5 bg-card rounded-sm">
        <ImagePicker
          files={files}
          onChange={setFiles}
          disabled={isLoading}
        />
        {uploadProgress !== null && (
          <div className="mt-4">
            <div className="h-1 bg-card-light rounded-sm overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] tracking-[0.15em] uppercase text-muted">
              Subiendo imágenes · {uploadProgress}%
            </p>
          </div>
        )}
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
          className="px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-muted hover:text-white transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm disabled:opacity-50"
        >
          {isLoading ? "Creando..." : "Crear producto"}
        </button>
      </div>
    </form>
  );
};
