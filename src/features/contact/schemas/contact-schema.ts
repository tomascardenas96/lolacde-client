import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Ingresá tu nombre")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().min(1, "Ingresá tu email").email("Email inválido"),
  phone: z
    .string()
    .max(30, "Teléfono demasiado largo")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
