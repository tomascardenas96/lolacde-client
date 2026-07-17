import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { AuthResponse } from "@/types/auth";
import { useAuthStore } from "../store/authStore";
import { RegisterFormValues } from "../schemas/register-schema";
import { AxiosError } from "axios";

/**
 * Servicio de Autenticación Centralizado.
 * Maneja la comunicación con la API y la sincronización del Store Global.
 */
export const authService = {
    /**
     * Recupera la sesión activa mediante la cookie HttpOnly.
     */
    getMe: async (): Promise<void> => {
        const { setAuth, clearAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            const { data } = await apiClient.get<AuthResponse>("/auth/me");

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", `Sesión recuperada: ${data.user.email}`);
            }
        } catch (error: unknown) {
            clearAuth();

            if (error instanceof AxiosError && error.response?.status === 401) {
                logger.info("AUTH_SERVICE", "Navegación como invitado.");
                return;
            }

            const message = error instanceof AxiosError ? error.message : "Unknown error";
            logger.error("AUTH_SERVICE", "Fallo técnico", message);
            throw error;
        } finally {
            // Garantizando liberación de UI.
            setChecking(false);
        }
    },

    /**
     * Inicia sesión y permite que el servidor plante la cookie HttpOnly.
     */
    login: async (email: string, password: string): Promise<void> => {
        const { setAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", `Intentando login para: ${email}`);

            const { data } = await apiClient.post<AuthResponse>("/auth/login", {
                email,
                password,
            });

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", "Login exitoso y Store actualizado.");
            }
        } catch (error: unknown) {
            const errorMsg = getApiErrorMessage(error, "No se pudo iniciar sesión");
            logger.error("AUTH_SERVICE", "Fallo en el inicio de sesión", errorMsg);
            throw error;
        } finally {
            setChecking(false);
        }
    },

    /**
     * Cierra la sesión y limpia la cookie mediante el servidor.
     */
    logout: async (): Promise<void> => {
        const { clearAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", "Solicitando cierre de sesión al servidor...");

            await apiClient.post("/auth/logout");

            logger.info("AUTH_SERVICE", "Cookie invalidada y sesión terminada.");
        } catch (error: unknown) {
            const message = error instanceof AxiosError ? error.message : "Unknown error";
            logger.error("AUTH_SERVICE", "Error al cerrar sesión en el servidor", message);
        } finally {
            // Limpiamos el storage persistido directamente para evitar que
            // clearAuth() dispare un re-render que muestre "Ingresar" antes
            // de que el navegador complete la redirección.
            localStorage.removeItem("auth-storage");
            window.location.href = "/login";
        }
    },

    /**
     * Registra un nuevo usuario e iniciar sesion
     */
    register: async (userData: Omit<RegisterFormValues, "confirmPassword">): Promise<void> => {
        const { setAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", "Intentando registro de nuevo usuario para ", userData.email);

            const { data } = await apiClient.post<AuthResponse>("/auth/register", userData);

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", "Registro exitoso y sesión iniciada");
            }
        } catch (error: unknown) {
            const errorMsg = getApiErrorMessage(error, "No se pudo completar el registro");
            logger.error("AUTH_SERVICE", "Fallo en el registro de usuario", errorMsg);

            throw error;
        } finally {
            setChecking(false);
        }
    },

    /**
     * Solicita el envío del correo de recuperación de contraseña.
     */
    forgotPassword: async (email: string): Promise<void> => {
        await apiClient.post("/auth/forgot-password", { email });
        logger.info("AUTH_SERVICE", "Solicitud de recuperación enviada");
    },

    /**
     * Restablece la contraseña usando el token recibido por correo.
     */
    resetPassword: async (payload: {
        token: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<void> => {
        await apiClient.post("/auth/reset-password", payload);
        logger.info("AUTH_SERVICE", "Contraseña restablecida");
    },

    /**
     * Confirma el correo electrónico a partir del token del link.
     */
    confirmEmail: async (token: string): Promise<void> => {
        await apiClient.get("/auth/confirm", { params: { token } });
        logger.info("AUTH_SERVICE", "Email confirmado");
    },

    /**
     * Cambia la contraseña del usuario autenticado.
     */
    changePassword: async (payload: {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<void> => {
        await apiClient.post("/auth/change-password", payload);
        logger.info("AUTH_SERVICE", "Contraseña actualizada");
    },

    /**
     * Reenvía el correo de confirmación de cuenta.
     */
    sendConfirmationMail: async (email: string): Promise<void> => {
        await apiClient.post("/auth/send-confirmation-mail", { email });
        logger.info("AUTH_SERVICE", "Correo de confirmación reenviado");
    },
};