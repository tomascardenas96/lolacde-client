import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import {
  CreateAdjustmentDto,
  CreateAdjustmentResponse,
} from "../types/state.types";

export const inventoryService = {
  createAdjustment: async (
    payload: CreateAdjustmentDto,
  ): Promise<CreateAdjustmentResponse> => {
    const { data } = await apiClient.post<CreateAdjustmentResponse>(
      "/inventory/adjustments",
      payload,
    );
    logger.info(
      "INVENTORY_SERVICE",
      `Ajuste de ${payload.quantity} sobre variante ${payload.variantId}`,
    );
    return data;
  },
};
