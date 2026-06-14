import type {
  DashboardStats,
  MarketPerformance,
  RevenueDataPoint,
  TopProduct,
} from "../types/dashboard.types";

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const monthKey = (year: number, monthIndex: number) =>
  `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

const indexByMonth = (stats: DashboardStats) =>
  new Map(stats.monthly.map((m) => [m.month, m]));

/** Ventas de los últimos 12 meses + proyección = media móvil de 3 meses. */
export function statsToMarketPerformance(
  stats: DashboardStats,
): MarketPerformance[] {
  const byMonth = indexByMonth(stats);
  const now = new Date();

  const buckets = Array.from({ length: 12 }, (_, k) => {
    const i = 11 - k;
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d.getFullYear(), d.getMonth());
    return { label: MONTH_LABELS[d.getMonth()], sales: byMonth.get(key)?.revenue ?? 0 };
  });

  return buckets.map((b, i) => {
    const window = buckets.slice(Math.max(0, i - 2), i + 1);
    const projections =
      window.reduce((s, w) => s + w.sales, 0) / window.length;
    return {
      month: b.label,
      sales: Math.round(b.sales),
      projections: Math.round(projections),
    };
  });
}

/** Ingresos mensuales del año actual vs el año anterior. */
export function statsToRevenueTimeline(
  stats: DashboardStats,
): RevenueDataPoint[] {
  const byMonth = indexByMonth(stats);
  const thisYear = new Date().getFullYear();

  return MONTH_LABELS.map((month, i) => ({
    month,
    revenue: Math.round(byMonth.get(monthKey(thisYear, i))?.revenue ?? 0),
    prevYear: Math.round(byMonth.get(monthKey(thisYear - 1, i))?.revenue ?? 0),
  }));
}

/** Top productos por ingresos (ya viene ordenado del backend). */
export function statsToTopProducts(stats: DashboardStats): TopProduct[] {
  return stats.topProducts.map((p) => ({
    name: p.name,
    sales: p.unitsSold,
    revenue: Math.round(p.revenue),
  }));
}

/** Variación porcentual del último mes respecto del anterior. */
export function monthlyTrend(
  stats: DashboardStats,
  field: "revenue" | "orderCount",
): number {
  const series = stats.monthly;
  if (series.length < 2) return 0;
  const current = series[series.length - 1][field];
  const previous = series[series.length - 2][field];
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
