"use client";

import { useMemo } from "react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { MarketChart } from "@/features/dashboard/components/MarketChart";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { useDashboardOrders } from "@/features/dashboard/hooks/useDashboardOrders";
import { deriveRecentActivity } from "@/features/dashboard/lib/deriveMetrics";
import {
  statsToMarketPerformance,
  monthlyTrend,
} from "@/features/dashboard/lib/statsMappers";

export default function DashboardOverviewPage() {
  // Métricas agregadas (sin descargar el detalle de las órdenes).
  const { stats, customerCount, isLoading } = useDashboardStats();
  // Solo las órdenes recientes para el feed de actividad (fetch liviano).
  const { orders, isLoading: ordersLoading } = useDashboardOrders(8);

  const marketPerformance = useMemo(
    () => (stats ? statsToMarketPerformance(stats) : []),
    [stats],
  );
  const recentActivities = useMemo(() => deriveRecentActivity(orders), [orders]);

  const revenue = stats?.revenue ?? 0;
  const orderCount = stats?.orderCount ?? 0;
  const aov = stats?.averageOrderValue ?? 0;
  const revenueTrend = stats ? monthlyTrend(stats, "revenue") : 0;
  const ordersTrend = stats ? monthlyTrend(stats, "orderCount") : 0;

  return (
    <div className="max-w-[1400px]">
      <DashboardHeader title="Resumen" subtitle="Centro de control y datos" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ingresos netos"
          value={`$${revenue.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
          trend={{
            value: `${Math.abs(revenueTrend)}%`,
            direction: revenueTrend >= 0 ? "up" : "down",
          }}
        />
        <StatCard
          label="Órdenes pagadas"
          value={orderCount.toLocaleString("es-AR")}
          trend={{
            value: `${Math.abs(ordersTrend)}%`,
            direction: ordersTrend >= 0 ? "up" : "down",
          }}
        />
        <StatCard
          label="Clientes"
          value={customerCount.toLocaleString("es-AR")}
        />
        <StatCard label="Ticket promedio" value={`$${aov.toFixed(2)}`} />
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          {isLoading && !stats ? (
            <div className="bg-card p-6 rounded-sm h-full flex items-center justify-center min-h-[300px]">
              <p className="text-xs text-muted tracking-[0.1em] uppercase">
                Cargando métricas...
              </p>
            </div>
          ) : (
            <MarketChart data={marketPerformance} />
          )}
        </div>
        <div>
          {ordersLoading && recentActivities.length === 0 ? (
            <div className="bg-card p-6 rounded-sm h-full flex items-center justify-center">
              <p className="text-xs text-muted tracking-[0.1em] uppercase">
                Cargando actividad...
              </p>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="bg-card p-6 rounded-sm h-full flex items-center justify-center">
              <p className="text-xs text-muted tracking-[0.1em] uppercase">
                Sin actividad reciente
              </p>
            </div>
          ) : (
            <RecentActivity items={recentActivities} />
          )}
        </div>
      </div>
    </div>
  );
}
