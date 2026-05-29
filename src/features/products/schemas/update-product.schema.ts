import z from "zod";

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(120, "El nombre debe tener menos de 120 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(2000, "La descripción debe tener menos de 2000 caracteres"),
  categoryId: z
    .string()
    .min(1, "Seleccioná una categoría")
    .uuid("La categoría seleccionada no es válida"),
  isActive: z.boolean(),
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
