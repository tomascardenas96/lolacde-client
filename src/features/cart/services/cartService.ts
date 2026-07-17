import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { AxiosError } from "axios";
import { useCartStore } from "../store/cartStore";
import { Cart } from "../types/state.types";

export const cartService = {
  getCart: async (): Promise<void> => {
    const { setCart, setLoading, setError } = useCartStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Cart>("/cart");
      const cart: Cart = { ...data, items: data.items ?? [] };
      setCart(cart);
      logger.info("CART_SERVICE", `Carrito cargado: ${cart.items.length} items`);
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "No se pudo cargar el carrito");
      setError(msg);
      logger.error("CART_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  addItem: async (variantId: string, quantity: number = 1): Promise<void> => {
    const { setCart, setError } = useCartStore.getState();
    try {
      const { data } = await apiClient.post<Cart>("/cart/items", {
        variantId,
        quantity,
      });
      setCart(data);
      logger.info("CART_SERVICE", "Item agregado al carrito");
    } catch (error: unknown) {
      const msg = getApiErrorMessage(
        error,
        "No se pudo agregar el producto al carrito",
      );
      setError(msg);
      logger.error("CART_SERVICE", msg, error);
      throw error;
    }
  },

  updateItemQuantity: async (
    itemId: string,
    quantity: number,
  ): Promise<void> => {
    const { setCart, setError } = useCartStore.getState();
    try {
      const { data } = await apiClient.patch<Cart>(`/cart/items/${itemId}`, {
        quantity,
      });
      setCart(data);
      logger.info("CART_SERVICE", `Cantidad actualizada: ${quantity}`);
    } catch (error: unknown) {
      // El item ya no existe (p. ej. otra acción lo eliminó): resincronizamos
      // el carrito en vez de tratarlo como un error.
      if (error instanceof AxiosError && error.response?.status === 404) {
        logger.info(
          "CART_SERVICE",
          "El item ya no existe, resincronizando carrito",
        );
        await cartService.getCart();
        return;
      }
      const msg = getApiErrorMessage(
        error,
        "No se pudo actualizar la cantidad",
      );
      setError(msg);
      logger.error("CART_SERVICE", msg, error);
      throw error;
    }
  },

  removeItem: async (itemId: string): Promise<void> => {
    const { setCart, setError } = useCartStore.getState();
    try {
      const { data } = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
      setCart(data);
      logger.info("CART_SERVICE", "Item eliminado del carrito");
    } catch (error: unknown) {
      // El item ya no existe (doble click / petición duplicada): el resultado
      // deseado ya se cumplió, así que resincronizamos sin propagar el error.
      if (error instanceof AxiosError && error.response?.status === 404) {
        logger.info(
          "CART_SERVICE",
          "El item ya no existe, resincronizando carrito",
        );
        await cartService.getCart();
        return;
      }
      const msg = getApiErrorMessage(
        error,
        "No se pudo eliminar el producto del carrito",
      );
      setError(msg);
      logger.error("CART_SERVICE", msg, error);
      throw error;
    }
  },

  clearCart: async (): Promise<void> => {
    const { clearCart, setError } = useCartStore.getState();
    try {
      await apiClient.delete("/cart");
      clearCart();
      logger.info("CART_SERVICE", "Carrito vaciado");
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "No se pudo vaciar el carrito");
      setError(msg);
      logger.error("CART_SERVICE", msg, error);
      throw error;
    }
  },
};
