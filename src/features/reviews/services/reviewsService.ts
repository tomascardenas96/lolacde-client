import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import {
  CreateReviewPayload,
  GetReviewsParams,
  Review,
  ReviewEligibility,
  ReviewsResponse,
} from "../types/state.types";

export const reviewsService = {
  getReviews: async (
    productId: string,
    params: GetReviewsParams = {},
  ): Promise<ReviewsResponse> => {
    const { data } = await apiClient.get<ReviewsResponse>(
      `/products/${productId}/reviews`,
      { params },
    );
    logger.info(
      "REVIEWS_SERVICE",
      `${data.reviews?.length ?? 0} reseñas cargadas (producto ${productId})`,
    );
    return data;
  },

  getEligibility: async (productId: string): Promise<ReviewEligibility> => {
    const { data } = await apiClient.get<ReviewEligibility>(
      `/products/${productId}/reviews/eligibility`,
    );
    return data;
  },

  createReview: async (
    productId: string,
    payload: CreateReviewPayload,
  ): Promise<Review> => {
    const { data } = await apiClient.post<Review>(
      `/products/${productId}/reviews`,
      payload,
    );
    logger.info("REVIEWS_SERVICE", `Reseña creada para producto ${productId}`);
    return data;
  },
};
