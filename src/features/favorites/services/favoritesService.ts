import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import type { Product } from "@/features/products/types/state.types";
import { useFavoritesStore } from "../store/favoritesStore";

export const favoritesService = {
  // Carga la lista completa de favoritos del usuario autenticado.
  getFavorites: async (): Promise<void> => {
    const { setFavorites, setLoading } = useFavoritesStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Product[]>("/favorites");
      setFavorites(data ?? []);
      logger.info(
        "FAVORITES_SERVICE",
        `${data?.length ?? 0} favoritos cargados`,
      );
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError ? error.message : "Error desconocido";
      logger.error("FAVORITES_SERVICE", "Error al obtener favoritos", msg);
    } finally {
      setLoading(false);
    }
  },

  // Alta optimista: marca el id de inmediato y revierte si la request falla.
  addFavorite: async (productId: string): Promise<void> => {
    const store = useFavoritesStore.getState();
    store.addId(productId);
    try {
      await apiClient.post(`/favorites/${productId}`);
      logger.info("FAVORITES_SERVICE", `Favorito agregado: ${productId}`);
    } catch (error: unknown) {
      useFavoritesStore.getState().removeId(productId);
      logger.error("FAVORITES_SERVICE", "Error al agregar favorito", error);
      throw error;
    }
  },

  // Baja optimista: quita el id/producto y resincroniza si la request falla.
  removeFavorite: async (productId: string): Promise<void> => {
    const store = useFavoritesStore.getState();
    store.removeId(productId);
    try {
      await apiClient.delete(`/favorites/${productId}`);
      logger.info("FAVORITES_SERVICE", `Favorito quitado: ${productId}`);
    } catch (error: unknown) {
      logger.error("FAVORITES_SERVICE", "Error al quitar favorito", error);
      await favoritesService.getFavorites();
      throw error;
    }
  },
};
