import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ message: "Elegí una puntuación" })
    .int()
    .min(1, "Elegí una puntuación")
    .max(5),
  comment: z
    .string()
    .max(1000, "El comentario no puede superar los 1000 caracteres")
    .optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
