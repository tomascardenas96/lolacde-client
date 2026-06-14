import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { ContactFormValues } from "../schemas/contact-schema";

export const contactService = {
  sendMessage: async (payload: ContactFormValues): Promise<void> => {
    await apiClient.post("/contact", {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      ...(payload.phone ? { phone: payload.phone } : {}),
    });
    logger.info("CONTACT_SERVICE", "Mensaje de contacto enviado");
  },
};
