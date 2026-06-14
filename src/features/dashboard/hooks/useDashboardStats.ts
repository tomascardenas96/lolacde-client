"use client";

import { useEffect, useRef } from "react";
import { dashboardStatsService } from "@/features/dashboard/services/dashboardStatsService";
import { useStatsStore } from "@/features/dashboard/store/statsStore";

/**
 * Carga las métricas agregadas del dashboard (una sola vez por montaje)
 * desde GET /orders/admin/stats, sin descargar el detalle de las órdenes.
 */
export function useDashboardStats() {
  const stats = useStatsStore((s) => s.stats);
  const customerCount = useStatsStore((s) => s.customerCount);
  const isLoading = useStatsStore((s) => s.isLoading);
  const error = useStatsStore((s) => s.error);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    dashboardStatsService.getStats();
  }, []);

  return { stats, customerCount, isLoading, error };
}
