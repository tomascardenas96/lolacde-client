"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MarketPerformance } from "../types/dashboard.types";

export const MarketChart = ({ data }: { data: MarketPerformance[] }) => {
  return (
    <div className="bg-card p-6 rounded-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">
          Rendimiento de ventas
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-xs text-muted">Ventas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-card-light" />
            <span className="text-xs text-muted">Proyección</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
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
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
                color: "#ededed",
                fontSize: "12px",
              }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Legend content={() => null} />
            <Bar
              dataKey="sales"
              fill="#c8a97e"
              radius={[2, 2, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="projections"
              fill="#2a2a2a"
              radius={[2, 2, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
