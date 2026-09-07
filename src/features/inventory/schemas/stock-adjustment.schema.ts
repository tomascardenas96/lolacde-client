import z from "zod";

export const adjustmentDirections = ["add", "remove"] as const;

export type AdjustmentDirection = (typeof adjustmentDirections)[number];

/**
 * La dirección y la cantidad se piden por separado en lugar de un número con
 * signo: en el mostrador "saqué 2" se entiende, "-2" se escribe mal.
 * El hook las combina en el delta que espera el backend.
 */
export const stockAdjustmentSchema = z.object({
  direction: z.enum(adjustmentDirections),
  quantity: z
    .number({ message: "La cantidad es obligatoria" })
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
  reason: z
    .string()
    .trim()
    .min(3, "El motivo es obligatorio")
    .max(200, "El motivo debe tener menos de 200 caracteres"),
});

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>;
