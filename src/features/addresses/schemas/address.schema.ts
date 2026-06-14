import z from "zod";

export const addressSchema = z.object({
  country: z
    .string()
    .trim()
    .min(1, "El país es obligatorio")
    .max(80, "El país debe tener menos de 80 caracteres"),
  state: z
    .string()
    .trim()
    .min(1, "La provincia o estado es obligatorio")
    .max(80, "La provincia debe tener menos de 80 caracteres"),
  city: z
    .string()
    .trim()
    .min(1, "La ciudad es obligatoria")
    .max(80, "La ciudad debe tener menos de 80 caracteres"),
  addressLine: z
    .string()
    .trim()
    .min(1, "El domicilio es obligatorio")
    .max(160, "El domicilio debe tener menos de 160 caracteres"),
  zipCode: z
    .string()
    .trim()
    .max(20, "El código postal debe tener menos de 20 caracteres")
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
