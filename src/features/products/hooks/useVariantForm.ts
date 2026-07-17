"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import {
  AddVariantFormValues,
  addVariantSchema,
} from "../schemas/add-variant.schema";
import { productsService } from "../services/productsService";
import {
  AddVariantDto,
  ProductVariant,
  UpdateVariantDto,
} from "../types/state.types";

interface UseVariantFormOptions {
  productId: string;
  /** Si se pasa una variante, el formulario opera en modo edición. */
  variant?: ProductVariant;
  onSuccess?: (variant: ProductVariant) => void;
}

const CREATE_DEFAULTS: AddVariantFormValues = {
  price: 0,
  stock: 0,
  attributes: [],
};

const toFormValues = (variant: ProductVariant): AddVariantFormValues => ({
  price: Number(variant.price) || 0,
  stock: variant.stock ?? 0,
  attributes: Object.entries(variant.attributes ?? {}).map(([key, value]) => ({
    key,
    value: String(value),
  })),
});

export const useVariantForm = ({
  productId,
  variant,
  onSuccess,
}: UseVariantFormOptions) => {
  const isEdit = Boolean(variant);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaults = variant ? toFormValues(variant) : CREATE_DEFAULTS;

  const form = useForm<AddVariantFormValues>({
    resolver: zodResolver(addVariantSchema),
    defaultValues: defaults,
  });

  const attributesArray = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const addAttribute = () => attributesArray.append({ key: "", value: "" });

  const buildAttributes = (values: AddVariantFormValues) =>
    values.attributes.reduce<Record<string, string>>((acc, entry) => {
      const key = entry.key.trim();
      if (key) acc[key] = entry.value.trim();
      return acc;
    }, {});

  const onSubmit = (values: AddVariantFormValues) => {
    startTransition(async () => {
      setServerError(null);
      const attributes = buildAttributes(values);
      try {
        let result: ProductVariant;
        if (variant) {
          logger.info("VARIANT_FORM", "Actualizando variante", variant.id);
          const dto: UpdateVariantDto = {
            price: values.price,
            stock: values.stock,
            attributes,
          };
          result = await productsService.updateVariant(
            productId,
            variant.id,
            dto,
          );
        } else {
          logger.info("VARIANT_FORM", "Creando variante", productId);
          const dto: AddVariantDto = {
            price: values.price,
            stock: values.stock,
          };
          if (Object.keys(attributes).length > 0) dto.attributes = attributes;
          result = await productsService.addVariant(productId, dto);
          form.reset(CREATE_DEFAULTS);
        }
        onSuccess?.(result);
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = isEdit
          ? "No se pudo actualizar la variante"
          : "No se pudo crear la variante";
        if (status === 404)
          fallback = isEdit
            ? "La variante o el producto ya no existen"
            : "El producto ya no existe";
        else if (status === 409)
          fallback = "Ya existe una variante con esos atributos";
        else if (status === 400) fallback = "Revisá los datos ingresados";
        const msg = getApiErrorMessage(err, fallback);
        setServerError(msg);
        logger.error("VARIANT_FORM", "Fallo al guardar variante", err);
      }
    });
  };

  const reset = () => {
    form.reset(defaults);
    setServerError(null);
  };

  return {
    form,
    attributesArray,
    addAttribute,
    serverError,
    isLoading: isPending,
    isEdit,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
};
