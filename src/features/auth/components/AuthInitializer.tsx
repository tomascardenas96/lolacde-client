"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logger } from "@/lib/logger";
import { authService } from "../services/authService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthInitializerProps {
  children: ReactNode;
}

/**
 * Inicializador de sesión global.
 * Maneja la hidratación del estado y previene errores de mismatch entre servidor y cliente.
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  // Extraemos las acciones necesarias del store de Zustand
  const setChecking = useAuthStore((state) => state.setChecking);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  /**
   * Estado local que solo refleja la verificación INICIAL de sesión.
   * Importante: no usamos el `isChecking` global del store como gate de
   * renderizado, porque ese flag lo togglea cualquier operación de auth
   * (getMe, login, etc.). Si dependiéramos de él, desmontaríamos y
   * volveríamos a montar todos los children en cada operación, lo que en
   * páginas como confirm-email provoca un loop de remount/refetch.
   */
  const [isInitializing, setIsInitializing] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Evitamos doble ejecución en StrictMode
    if (initialized.current) return;
    initialized.current = true;

    const syncSession = async () => {
      logger.info("AUTH_INITIALIZER", "Sincronizando identidad del usuario...");

      try {
        // Llamada al servicio que ya actualiza el Store internamente
        await authService.getMe();
      } catch (error) {
        logger.error(
          "AUTH_INITIALIZER",
          "Error crítico durante la sincronización",
          error,
        );
        clearAuth();
      } finally {
        // Liberamos el estado de carga pase lo que pase
        setChecking(false);
        setIsInitializing(false);
      }
    };

    syncSession();
  }, [clearAuth, setChecking]);

  /**
   * Pantalla de Carga (Splash Screen).
   * Se muestra únicamente durante la verificación inicial de sesión para
   * evitar parpadeos. Como `isInitializing` arranca en `true` tanto en el
   * servidor como en el primer render del cliente, no hay mismatch de
   * hidratación.
   */
  if (isInitializing) return <LoadingSpinner label="Cargando..." />;

  // Renderizado de la aplicación una vez autenticada/verificada.
  return <>{children}</>;
};
