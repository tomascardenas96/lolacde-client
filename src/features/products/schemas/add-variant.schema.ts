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

const priceField = z
  .number({ message: "El precio es obligatorio" })
  .positive("El precio debe ser mayor a 0")
  .refine(
    (n) => Number.isFinite(n) && Math.round(n * 100) === n * 100,
    "El precio debe tener como máximo 2 decimales",
  );

const attributesField = z.array(attributeEntrySchema).refine((entries) => {
  const keys = entries.map((e) => e.key.trim().toLowerCase());
  return new Set(keys).size === keys.length;
}, "Las claves de atributos no pueden repetirse");

/**
 * Alta de variante: el stock inicial sí se acepta. El backend no lo escribe
 * en la columna, lo siembra como movimiento ADJUSTMENT del kardex.
 */
export const addVariantSchema = z.object({
  price: priceField,
  stock: z
    .number({ message: "El stock es obligatorio" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  attributes: attributesField,
});

/**
 * Edición de variante: sin `stock`. El backend lo omite en
 * UpdateProductVariantDto y valida con forbidNonWhitelisted, así que enviarlo
 * responde 400. El saldo se corrige con POST /inventory/adjustments.
 */
export const editVariantSchema = addVariantSchema.partial({ stock: true });

/** Estado del formulario en ambos modos: en edición `stock` no viaja. */
export type VariantFormValues = z.infer<typeof editVariantSchema>;
