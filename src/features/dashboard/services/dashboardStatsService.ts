import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import type {
  CustomersResponse,
  DashboardStats,
} from "../types/dashboard.types";
import { useStatsStore } from "../store/statsStore";

interface StatsRange {
  from?: string;
  to?: string;
}

export const dashboardStatsService = {
  // Carga las métricas agregadas (revenue, órdenes, AOV, top, serie mensual)
  // y el total de clientes, sin descargar el detalle de las órdenes.
  getStats: async (range: StatsRange = {}): Promise<void> => {
    const { setStats, setCustomerCount, setLoading, setError } =
      useStatsStore.getState();
    try {
      setLoading(true);

      const params: Record<string, string> = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;

      const [statsRes, customersRes] = await Promise.all([
        apiClient.get<DashboardStats>("/orders/admin/stats", { params }),
        apiClient.get<CustomersResponse>("/user", { params: { limit: 1 } }),
      ]);

      setStats(statsRes.data);
      setCustomerCount(customersRes.data.total ?? 0);
      logger.info(
        "DASHBOARD_STATS_SERVICE",
        `Stats cargadas (revenue: ${statsRes.data.revenue}, órdenes: ${statsRes.data.orderCount})`,
      );
    } catch (error: unknown) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message || "Error al obtener las métricas"
          : "Error al obtener las métricas";
      setError(msg);
      logger.error("DASHBOARD_STATS_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },
};
