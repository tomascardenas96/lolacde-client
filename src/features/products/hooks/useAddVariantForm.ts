"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { logger } from "@/lib/logger";
import {
  AddVariantFormValues,
  addVariantSchema,
} from "../schemas/add-variant.schema";
import { productsService } from "../services/productsService";
import { AddVariantDto, ProductVariant } from "../types/state.types";

interface UseAddVariantFormOptions {
  productId: string;
  onAdded?: (variant: ProductVariant) => void;
}

const extractApiError = (err: unknown, fallback: string) => {
  if (!(err instanceof AxiosError)) return fallback;
  const data = err.response?.data?.message;
  if (Array.isArray(data)) return data.join(" · ");
  if (typeof data === "string") return data;
  return fallback;
};

const DEFAULTS: AddVariantFormValues = {
  price: 0,
  stock: 0,
  attributes: [],
};

export const useAddVariantForm = ({
  productId,
  onAdded,
}: UseAddVariantFormOptions) => {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<AddVariantFormValues>({
    resolver: zodResolver(addVariantSchema),
    defaultValues: DEFAULTS,
  });

  const attributesArray = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const addAttribute = () =>
    attributesArray.append({ key: "", value: "" });

  const toDto = (values: AddVariantFormValues): AddVariantDto => {
    const attributes = values.attributes.reduce<Record<string, string>>(
      (acc, entry) => {
        const key = entry.key.trim();
        if (key) acc[key] = entry.value.trim();
        return acc;
      },
      {},
    );

    const dto: AddVariantDto = {
      price: values.price,
      stock: values.stock,
    };
    if (Object.keys(attributes).length > 0) dto.attributes = attributes;
    return dto;
  };

  const onSubmit = (values: AddVariantFormValues) => {
    startTransition(async () => {
      setServerError(null);
      try {
        logger.info("ADD_VARIANT_FORM", "Creando variante", productId);
        const created = await productsService.addVariant(
          productId,
          toDto(values),
        );
        form.reset(DEFAULTS);
        onAdded?.(created);
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = "No se pudo crear la variante";
        if (status === 404) fallback = "El producto ya no existe";
        else if (status === 409)
          fallback = "Ya existe una variante con esos atributos";
        else if (status === 400) fallback = "Datos inválidos";
        const msg = extractApiError(err, fallback);
        setServerError(msg);
        logger.error("ADD_VARIANT_FORM", "Fallo al crear variante", err);
      }
    });
  };

  const reset = () => {
    form.reset(DEFAULTS);
    setServerError(null);
  };

  return {
    form,
    attributesArray,
    addAttribute,
    serverError,
    isLoading: isPending,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
};
