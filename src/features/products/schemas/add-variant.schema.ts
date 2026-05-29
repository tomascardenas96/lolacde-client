import z from "zod";

const attributeEntrySchema = z.object({
  key: z
    .string()
    .min(1, "La clave del atributo es obligatoria")
    .max(40, "La clave debe tener menos de 40 caracteres"),
  value: z
    .string()
    .min(1, "El valor del atributo es obligatorio")
    .max(60, "El valor debe tener menos de 60 caracteres"),
});

export const addVariantSchema = z.object({
  price: z
    .number({ message: "El precio es obligatorio" })
    .positive("El precio debe ser mayor a 0")
    .refine(
      (n) => Number.isFinite(n) && Math.round(n * 100) === n * 100,
      "El precio debe tener como máximo 2 decimales",
    ),
  stock: z
    .number({ message: "El stock es obligatorio" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  attributes: z
    .array(attributeEntrySchema)
    .refine((entries) => {
      const keys = entries.map((e) => e.key.trim().toLowerCase());
      return new Set(keys).size === keys.length;
    }, "Las claves de atributos no pueden repetirse"),
});

export type AddVariantFormValues = z.infer<typeof addVariantSchema>;
