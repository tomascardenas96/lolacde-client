export interface DiscountValidation {
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  discountAmount: number;
}
