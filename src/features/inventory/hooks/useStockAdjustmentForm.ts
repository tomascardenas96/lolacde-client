"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import {
  StockAdjustmentFormValues,
  stockAdjustmentSchema,
} from "../schemas/stock-adjustment.schema";
import { inventoryService } from "../services/inventoryService";
import { CreateAdjustmentResponse } from "../types/state.types";

interface UseStockAdjustmentFormOptions {
  variantId: string;
  onSuccess?: (movement: CreateAdjustmentResponse) => void;
}

const DEFAULTS: StockAdjustmentFormValues = {
  direction: "add",
  quantity: 1,
  reason: "",
};

export const useStockAdjustmentForm = ({
  variantId,
  onSuccess,
}: UseStockAdjustmentFormOptions) => {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: DEFAULTS,
  });

  const onSubmit = (values: StockAdjustmentFormValues) => {
    startTransition(async () => {
      setServerError(null);
      try {
        const movement = await inventoryService.createAdjustment({
          variantId,
          // El backend espera el delta con signo, no el saldo final.
          quantity:
            values.direction === "remove" ? -values.quantity : values.quantity,
          reason: values.reason.trim(),
        });
        form.reset(DEFAULTS);
        onSuccess?.(movement);
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = "No se pudo registrar el ajuste";
        if (status === 404) fallback = "La variante ya no existe";
        else if (status === 409)
          fallback = "No hay stock suficiente para descontar esa cantidad";
        else if (status === 403)
          fallback = "Solo un administrador puede ajustar stock";
        const msg = getApiErrorMessage(err, fallback);
        setServerError(msg);
        logger.error("STOCK_ADJUSTMENT", "Fallo al registrar ajuste", err);
      }
    });
  };

  const reset = () => {
    form.reset(DEFAULTS);
    setServerError(null);
  };

  return {
    form,
    serverError,
    isLoading: isPending,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
};
