import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { DiscountValidation } from "../types/state.types";

export const discountService = {
  validateCoupon: async (
    code: string,
    subtotal: number,
  ): Promise<DiscountValidation> => {
    const { data } = await apiClient.post<DiscountValidation>(
      "/discount/validate",
      { code, subtotal },
    );
    logger.info("DISCOUNT_SERVICE", `Cupón ${code} validado`);
    return data;
  },
};
