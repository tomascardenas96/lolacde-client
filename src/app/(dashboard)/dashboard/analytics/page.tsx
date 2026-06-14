"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import {
  statsToRevenueTimeline,
  statsToTopProducts,
} from "@/features/dashboard/lib/statsMappers";

export default function AnalyticsPage() {
  const { stats, customerCount } = useDashboardStats();

  const revenueTimeline = useMemo(
    () => (stats ? statsToRevenueTimeline(stats) : []),
    [stats],
  );
  const topProducts = useMemo(
    () => (stats ? statsToTopProducts(stats) : []),
    [stats],
  );

  const totalRevenue = stats?.revenue ?? 0;
  const orderCount = stats?.orderCount ?? 0;
  const aov = stats?.averageOrderValue ?? 0;

  return (
    <div className="max-w-[1400px]">
      <DashboardHeader title="Analíticas" subtitle="Indicadores de rendimiento" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ingresos totales"
          value={`$${totalRevenue.toLocaleString("es-AR")}`}
        />
        <StatCard
          label="Órdenes pagadas"
          value={orderCount.toLocaleString("es-AR")}
        />
        <StatCard label="Ticket promedio" value={`$${aov.toFixed(2)}`} />
        <StatCard
          label="Clientes"
          value={customerCount.toLocaleString("es-AR")}
        />
      </div>

      {/* Revenue Timeline */}
      <div className="bg-card p-6 rounded-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
            Ingresos por mes
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-xs text-muted">Este año</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-muted" />
              <span className="text-xs text-muted">Año anterior</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTimeline}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#888888", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#888888", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "#ededed",
                  fontSize: "12px",
                }}
                formatter={(value) => [`$${Number(value).toLocaleString("es-AR")}`, ""]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c8a97e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="prevYear"
                stroke="#888888"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top SKUs */}
      <div className="bg-card p-6 rounded-sm">
        <h3 className="text-[0.65rem] tracking-[0.2em] text-muted uppercase mb-6">
          Top SKUs por ingresos
        </h3>
        {topProducts.length === 0 ? (
          <p className="text-xs text-muted tracking-[0.1em] uppercase py-10 text-center">
            Sin datos de ventas todavía
          </p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" barSize={16}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#888888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#888888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "#ededed",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [
                    `$${Number(value).toLocaleString("es-AR")}`,
                    "Ingresos",
                  ]}
                />
                <Bar dataKey="revenue" fill="#c8a97e" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
