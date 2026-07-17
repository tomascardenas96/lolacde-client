import z from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  parentId: z
    .string()
    .uuid("ID de categoría inválido")
    .optional()
    .or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
