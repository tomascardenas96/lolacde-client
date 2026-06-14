"use client";

import { useEffect, useRef } from "react";
import { adminOrdersService } from "@/features/admin-orders/services/adminOrdersService";
import { useAdminOrdersStore } from "@/features/admin-orders/store/adminOrdersStore";

/**
 * Carga el conjunto de órdenes (una sola vez por montaje) y expone las
 * porciones del store que las métricas del dashboard derivan en cliente.
 */
export function useDashboardOrders(limit = 500) {
  const orders = useAdminOrdersStore((s) => s.orders);
  const total = useAdminOrdersStore((s) => s.total);
  const isLoading = useAdminOrdersStore((s) => s.isLoading);
  const error = useAdminOrdersStore((s) => s.error);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    adminOrdersService.getOrders({ limit });
  }, [limit]);

  return { orders, total, isLoading, error };
}
