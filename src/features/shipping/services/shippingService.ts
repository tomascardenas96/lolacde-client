import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { ShippingMethod } from "../types/state.types";

export const shippingService = {
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    const { data } = await apiClient.get<ShippingMethod[]>("/shipping-method");
    logger.info(
      "SHIPPING_SERVICE",
      `${data.length} métodos de envío cargados`,
    );
    return data;
  },
};
