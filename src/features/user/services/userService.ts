import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";

export const userService = {
  // Actualiza los datos editables del usuario (nombre y apellido).
  updateProfile: async (payload: {
    name?: string;
    lastname?: string;
  }): Promise<void> => {
    await apiClient.patch("/user", payload);
    logger.info("USER_SERVICE", "Perfil actualizado");
  },

  // Baja lógica de la cuenta del usuario autenticado (DELETE /user/me).
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/user/me");
    logger.info("USER_SERVICE", "Cuenta eliminada");
  },
};
