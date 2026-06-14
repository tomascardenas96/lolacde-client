export interface ReviewAuthor {
  id: string;
  name: string;
  lastname: string | null;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user?: ReviewAuthor;
}

export interface ReviewsResponse {
  total: number;
  reviews: Review[];
}

export interface ReviewEligibility {
  canReview: boolean;
  alreadyReviewed: boolean;
  hasPurchased: boolean;
}

export interface GetReviewsParams {
  limit?: number;
  offset?: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}
