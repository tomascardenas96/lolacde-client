import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import type {
  Customer,
  CustomersResponse,
  ServerCustomer,
} from "../types/dashboard.types";
import { useCustomersStore } from "../store/customersStore";

const toCustomer = (c: ServerCustomer): Customer => ({
  id: c.id,
  name: `${c.name ?? ""} ${c.lastname ?? ""}`.trim() || "Cliente",
  email: c.email,
  totalOrders: c.ordersCount,
  totalSpent: Math.round(c.totalSpent),
  joinedAt: c.createdAt,
  status: c.ordersCount > 0 ? "active" : "inactive",
});

interface GetCustomersParams {
  limit?: number;
  offset?: number;
}

export const customersService = {
  // Consume GET /user (paginado, con agregados) en vez de derivar de órdenes.
  getCustomers: async (params: GetCustomersParams = {}): Promise<void> => {
    const { setCustomers, setLoading, setError } =
      useCustomersStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<CustomersResponse>("/user", {
        params,
      });
      const customers = (data.data ?? []).map(toCustomer);
      setCustomers(customers, data.total ?? customers.length);
      logger.info(
        "CUSTOMERS_SERVICE",
        `${customers.length} clientes cargados (total: ${data.total ?? customers.length})`,
      );
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al obtener los clientes"
          : "Error al obtener los clientes";
      setError(msg);
      logger.error("CUSTOMERS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },
};
