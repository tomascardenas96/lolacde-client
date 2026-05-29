import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import { useOrdersStore } from "../store/ordersStore";
import { useCartStore } from "@/features/cart/store/cartStore";
import {
  Order,
  PaymentResponse,
  CheckoutPayload,
  PayPayload,
} from "../types/state.types";

export const ordersService = {
  checkout: async (payload: CheckoutPayload): Promise<Order> => {
    const { addOrder, setLoading, setError } = useOrdersStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.post<Order>("/orders", payload);
      addOrder(data);
      // El backend vacia el carrito automaticamente al crear la orden
      useCartStore.getState().clearCart();
      logger.info("ORDERS_SERVICE", `Orden creada: ${data.id}`);
      return data;
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al crear la orden"
          : "Error al crear la orden";
      setError(msg);
      logger.error("ORDERS_SERVICE", msg, error);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  pay: async (orderId: string, payload: PayPayload): Promise<PaymentResponse> => {
    const { setError } = useOrdersStore.getState();
    try {
      const { data } = await apiClient.post<PaymentResponse>(
        `/orders/${orderId}/pay`,
        payload,
      );
      logger.info("ORDERS_SERVICE", `Pago iniciado para orden ${orderId}`);
      return data;
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al iniciar el pago"
          : "Error al iniciar el pago";
      setError(msg);
      logger.error("ORDERS_SERVICE", msg, error);
      throw error;
    }
  },

  getOrders: async (): Promise<void> => {
    const { setOrders, setLoading, setError } = useOrdersStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Order[]>("/orders");
      setOrders(data);
      logger.info("ORDERS_SERVICE", `${data.length} ordenes cargadas`);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al obtener las ordenes"
          : "Error al obtener las ordenes";
      setError(msg);
      logger.error("ORDERS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  getOrder: async (orderId: string): Promise<void> => {
    const { setSelectedOrder, setLoading, setError } =
      useOrdersStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
      setSelectedOrder(data);
      logger.info("ORDERS_SERVICE", `Orden ${orderId} cargada`);
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al obtener la orden"
          : "Error al obtener la orden";
      setError(msg);
      logger.error("ORDERS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  // Relectura silenciosa de la orden (sin togglear el loading global).
  // Se usa para el polling al volver de Mercado Pago, donde el estado real
  // lo confirma el webhook server-to-server y puede tardar unos segundos.
  refreshOrder: async (orderId: string): Promise<Order> => {
    const { setSelectedOrder } = useOrdersStore.getState();
    const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
    setSelectedOrder(data);
    return data;
  },
};
