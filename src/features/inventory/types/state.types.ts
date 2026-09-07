// --- API response types ---

export type StockMovementType =
  | "purchase"
  | "sale"
  | "return"
  | "adjustment"
  | "internal_use";

export interface StockMovement {
  id: string;
  type: StockMovementType;
  /** Con signo: negativo sale de la góndola, positivo entra. */
  quantity: number;
  unitCost: number | null;
  /** Saldo de la variante después de aplicar el movimiento. */
  balanceAfter: number;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  createdAt?: string;
}

// --- Create adjustment DTO ---

/**
 * `quantity` es el delta con signo, no el saldo final. `reason` es obligatorio:
 * un ajuste sin motivo deja el kardex sin explicación.
 */
export interface CreateAdjustmentDto {
  variantId: string;
  quantity: number;
  reason: string;
  unitCost?: number;
}

/**
 * `null` cuando la variante tiene `trackStock` en false: el backend no anota
 * movimiento y eso no es un error.
 */
export type CreateAdjustmentResponse = StockMovement | null;
