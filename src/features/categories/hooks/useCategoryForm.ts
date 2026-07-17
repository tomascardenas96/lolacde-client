"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { getApiErrorMessage } from "@/lib/error-utils";
import { logger } from "@/lib/logger";
import { categoriesService } from "../services/categoriesService";
import { categorySchema, CategoryFormValues } from "../schemas/category.schema";
import { Category } from "../types/state.types";

interface UseCategoryFormOptions {
  category?: Category;
  onSuccess?: () => void;
}

export function useCategoryForm({ category, onSuccess }: UseCategoryFormOptions = {}) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    values: {
      name: category?.name ?? "",
      parentId: category?.parent?.id ?? "",
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      setServerError(null);
      const parentId = values.parentId || undefined;

      try {
        if (category) {
          await categoriesService.updateCategory(category.id, {
            name: values.name,
            parentId,
          });
        } else {
          await categoriesService.createCategory({
            name: values.name,
            parentId,
          });
        }
        await categoriesService.loadCategories();
        onSuccess?.();
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = category
          ? "No se pudo actualizar la categoría"
          : "No se pudo crear la categoría";
        if (status === 409) fallback = "Ya existe una categoría con ese nombre";
        if (status === 404) fallback = "La categoría ya no existe";
        const msg = getApiErrorMessage(err, fallback);
        setServerError(msg);
        logger.error("CATEGORY_FORM", "Error al guardar categoría", err);
      }
    });
  };

  return {
    form,
    isLoading: isPending,
    serverError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
