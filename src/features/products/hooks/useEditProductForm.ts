"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { logger } from "@/lib/logger";
import { productsService } from "../services/productsService";
import {
  UpdateProductFormValues,
  updateProductSchema,
} from "../schemas/update-product.schema";
import { Product, ProductVariant, UpdateProductDto } from "../types/state.types";

interface UseEditProductFormOptions {
  productId: string;
  onUpdated?: (product: Product) => void;
}

const extractApiError = (err: unknown, fallback: string) => {
  if (!(err instanceof AxiosError)) return fallback;
  const data = err.response?.data?.message;
  if (Array.isArray(data)) return data.join(" · ");
  if (typeof data === "string") return data;
  return fallback;
};

export const useEditProductForm = ({
  productId,
  onUpdated,
}: UseEditProductFormOptions) => {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      setIsLoadingProduct(true);
      setLoadError(null);
      try {
        const data = await productsService.getProductById(productId);
        if (!active) return;
        setProduct(data);
        form.reset({
          name: data.name,
          description: data.description ?? "",
          categoryId: data.category?.id ?? "",
          isActive: data.isActive,
        });
      } catch (err: unknown) {
        if (!active) return;
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        const fallback =
          status === 404
            ? "El producto no existe o fue eliminado"
            : "No se pudo cargar el producto";
        const msg = extractApiError(err, fallback);
        setLoadError(msg);
        logger.error("EDIT_PRODUCT_FORM", "Fallo al cargar producto", err);
      } finally {
        if (active) setIsLoadingProduct(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [productId, form]);

  const buildDiff = (values: UpdateProductFormValues): UpdateProductDto => {
    if (!product) return {};
    const dto: UpdateProductDto = {};
    const trimmedName = values.name.trim();
    const trimmedDesc = values.description.trim();
    if (trimmedName !== product.name) dto.name = trimmedName;
    if (trimmedDesc !== (product.description ?? "")) dto.description = trimmedDesc;
    if (values.categoryId !== (product.category?.id ?? ""))
      dto.categoryId = values.categoryId;
    if (values.isActive !== product.isActive) dto.isActive = values.isActive;
    return dto;
  };

  const onSubmit = (values: UpdateProductFormValues) => {
    startTransition(async () => {
      setServerError(null);
      const dto = buildDiff(values);

      if (Object.keys(dto).length === 0) {
        setServerError("No hay cambios para guardar");
        return;
      }

      try {
        logger.info("EDIT_PRODUCT_FORM", "Actualizando producto", productId);
        const updated = await productsService.updateProduct(productId, dto);
        setProduct(updated);
        form.reset({
          name: updated.name,
          description: updated.description ?? "",
          categoryId: updated.category?.id ?? "",
          isActive: updated.isActive,
        });
        onUpdated?.(updated);
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = "No se pudo actualizar el producto";
        if (status === 404) fallback = "El producto ya no existe";
        else if (status === 409)
          fallback = "Ya existe un producto con ese nombre";
        else if (status === 400) fallback = "Datos inválidos";
        const msg = extractApiError(err, fallback);
        setServerError(msg);
        logger.error("EDIT_PRODUCT_FORM", "Fallo al actualizar producto", err);
      }
    });
  };

  const appendVariant = (variant: ProductVariant) =>
    setProduct((prev) =>
      prev ? { ...prev, variants: [...prev.variants, variant] } : prev,
    );

  return {
    form,
    product,
    isLoadingProduct,
    loadError,
    serverError,
    isLoading: isPending,
    onSubmit: form.handleSubmit(onSubmit),
    appendVariant,
  };
};
