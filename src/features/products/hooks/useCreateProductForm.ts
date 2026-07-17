"use client";

import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import {
  CreateProductFormValues,
  createProductSchema,
} from "../schemas/create-product.schema";
import { productsService } from "../services/productsService";
import { CreateProductDto, ProductImage } from "../types/state.types";

interface UseCreateProductFormOptions {
  onCreated?: (args: {
    productId: string;
    images: ProductImage[];
  }) => void;
}

export const useCreateProductForm = (options: UseCreateProductFormOptions = {}) => {
  const { onCreated } = options;
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      isActive: true,
      variants: [
        {
          price: 0,
          stock: 0,
          attributes: [{ key: "", value: "" }],
        },
      ],
    },
  });

  const variantsArray = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const addVariant = () =>
    variantsArray.append({
      price: 0,
      stock: 0,
      attributes: [{ key: "", value: "" }],
    });

  const toDto = (values: CreateProductFormValues): CreateProductDto => ({
    name: values.name.trim(),
    description: values.description.trim(),
    categoryId: values.categoryId,
    isActive: values.isActive,
    variants: values.variants.map((variant) => ({
      price: variant.price,
      stock: variant.stock,
      attributes: variant.attributes.reduce<Record<string, string>>(
        (acc, entry) => {
          const key = entry.key.trim();
          if (key) acc[key] = entry.value.trim();
          return acc;
        },
        {},
      ),
    })),
  });

  const onSubmit = (values: CreateProductFormValues) => {
    startTransition(async () => {
      setServerError(null);
      setUploadProgress(null);

      try {
        logger.info("CREATE_PRODUCT_FORM", "Creando producto", values.name);
        const created = await productsService.createProduct(toDto(values));

        let images: ProductImage[] = [];
        if (files.length > 0) {
          setUploadProgress(0);
          images = await productsService.uploadProductImages(
            created.id,
            files,
            setUploadProgress,
          );
        }

        logger.info(
          "CREATE_PRODUCT_FORM",
          `Producto ${created.id} creado con ${images.length} imagen(es)`,
        );
        onCreated?.({ productId: created.id, images });
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, "No se pudo crear el producto");
        setServerError(msg);
        logger.error("CREATE_PRODUCT_FORM", "Fallo al crear el producto", err);
      } finally {
        setUploadProgress(null);
      }
    });
  };

  return {
    form,
    variantsArray,
    addVariant,
    files,
    setFiles,
    uploadProgress,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isPending,
    serverError,
  };
};
