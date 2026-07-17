import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { useAdminOrdersStore } from "../store/adminOrdersStore";
import type {
  AdminOrder,
  AdminOrdersResponse,
  AdminOrdersQuery,
  AdminOrderStatus,
} from "../types/state.types";

export const adminOrdersService = {
  getOrders: async (query: AdminOrdersQuery = {}): Promise<void> => {
    const { setOrders, setLoading, setError } =
      useAdminOrdersStore.getState();
    try {
      setLoading(true);
      const params: Record<string, string | number> = {};
      if (query.limit) params.limit = query.limit;
      if (query.offset !== undefined) params.offset = query.offset;
      if (query.statuses && query.statuses.length > 0) {
        params.statuses = query.statuses.join(",");
      } else if (query.status) {
        params.status = query.status;
      }

      const { data } = await apiClient.get<AdminOrdersResponse>(
        "/orders/admin",
        { params },
      );
      setOrders(data.data, data.total);
      logger.info(
        "ADMIN_ORDERS_SERVICE",
        `${data.data.length} órdenes cargadas (total: ${data.total})`,
      );
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "No se pudieron cargar las órdenes");
      setError(msg);
      logger.error("ADMIN_ORDERS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  getOrder: async (orderId: string): Promise<void> => {
    const { setSelectedOrder, setLoading, setError } =
      useAdminOrdersStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<AdminOrder>(
        `/orders/admin/${orderId}`,
      );
      setSelectedOrder(data);
      logger.info("ADMIN_ORDERS_SERVICE", `Orden ${orderId} cargada`);
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "No se pudo cargar la orden");
      setError(msg);
      logger.error("ADMIN_ORDERS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  updateStatus: async (
    orderId: string,
    status: AdminOrderStatus,
  ): Promise<void> => {
    const { updateOrderStatus, setUpdating, setError } =
      useAdminOrdersStore.getState();
    try {
      setUpdating(true);
      await apiClient.patch(`/orders/admin/${orderId}/status`, { status });
      updateOrderStatus(orderId, status);
      logger.info(
        "ADMIN_ORDERS_SERVICE",
        `Orden ${orderId} actualizada a ${status}`,
      );
    } catch (error: unknown) {
      const msg = getApiErrorMessage(
        error,
        "No se pudo actualizar el estado de la orden",
      );
      setError(msg);
      logger.error("ADMIN_ORDERS_SERVICE", msg, error);
      throw error;
    } finally {
      setUpdating(false);
    }
  },
};
