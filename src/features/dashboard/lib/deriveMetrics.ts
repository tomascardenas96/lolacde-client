import type {
  AdminOrder,
  AdminOrderStatus,
} from "@/features/admin-orders/types/state.types";
import type {
  Customer,
  MarketPerformance,
  OverviewStats,
  RecentActivityItem,
  RevenueDataPoint,
  TopProduct,
} from "../types/dashboard.types";

// Estados que cuentan como ingresos efectivos.
const REVENUE_STATUSES: AdminOrderStatus[] = ["paid", "shipped", "delivered"];

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

const isRevenueOrder = (o: AdminOrder) => REVENUE_STATUSES.includes(o.status);
const amount = (o: AdminOrder) => Number(o.totalAmount) || 0;

const percentChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/** KPIs principales del overview con tendencia mes contra mes. */
export function deriveOverviewStats(
  orders: AdminOrder[],
  total: number,
): OverviewStats {
  const revenueOrders = orders.filter(isRevenueOrder);
  const netRevenue = revenueOrders.reduce((sum, o) => sum + amount(o), 0);
  const aov = revenueOrders.length ? netRevenue / revenueOrders.length : 0;
  const activeClients = new Set(orders.map((o) => o.user?.id).filter(Boolean))
    .size;

  // Tendencia: mes actual vs mes anterior.
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const prevDate = new Date(thisYear, thisMonth - 1, 1);
  const prevMonth = prevDate.getMonth();
  const prevYear = prevDate.getFullYear();

  const inMonth = (o: AdminOrder, m: number, y: number) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === m && d.getFullYear() === y;
  };

  const curRevenue = revenueOrders
    .filter((o) => inMonth(o, thisMonth, thisYear))
    .reduce((s, o) => s + amount(o), 0);
  const prvRevenue = revenueOrders
    .filter((o) => inMonth(o, prevMonth, prevYear))
    .reduce((s, o) => s + amount(o), 0);

  const curClients = new Set(
    orders.filter((o) => inMonth(o, thisMonth, thisYear)).map((o) => o.user?.id),
  ).size;
  const prvClients = new Set(
    orders.filter((o) => inMonth(o, prevMonth, prevYear)).map((o) => o.user?.id),
  ).size;

  const curOrders = revenueOrders.filter((o) =>
    inMonth(o, thisMonth, thisYear),
  ).length;
  const prvOrders = revenueOrders.filter((o) =>
    inMonth(o, prevMonth, prevYear),
  ).length;
  const curAov = curOrders ? curRevenue / curOrders : 0;
  const prvAov = prvOrders ? prvRevenue / prvOrders : 0;

  return {
    netRevenue,
    netRevenueTrend: Number(percentChange(curRevenue, prvRevenue).toFixed(1)),
    totalOrders: total || orders.length,
    totalOrdersLabel: "Total",
    activeClients,
    activeClientsTrend: Number(percentChange(curClients, prvClients).toFixed(1)),
    aov: Number(aov.toFixed(2)),
    aovTrend: Number(percentChange(curAov, prvAov).toFixed(1)),
  };
}

/** Ventas por mes (últimos 12 meses) + proyección = media móvil de 3 meses. */
export function deriveMonthlyPerformance(
  orders: AdminOrder[],
): MarketPerformance[] {
  const now = new Date();
  const buckets: { label: string; sales: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ label: MONTH_LABELS[d.getMonth()], sales: 0 });
  }

  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  orders.filter(isRevenueOrder).forEach((o) => {
    const d = new Date(o.createdAt);
    if (d < startDate) return;
    const idx =
      (d.getFullYear() - startDate.getFullYear()) * 12 +
      (d.getMonth() - startDate.getMonth());
    if (idx >= 0 && idx < buckets.length) buckets[idx].sales += amount(o);
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

/** Ingresos mensuales del año actual vs año anterior. */
export function deriveRevenueTimeline(orders: AdminOrder[]): RevenueDataPoint[] {
  const thisYear = new Date().getFullYear();
  const current = new Array(12).fill(0);
  const previous = new Array(12).fill(0);

  orders.filter(isRevenueOrder).forEach((o) => {
    const d = new Date(o.createdAt);
    const m = d.getMonth();
    if (d.getFullYear() === thisYear) current[m] += amount(o);
    else if (d.getFullYear() === thisYear - 1) previous[m] += amount(o);
  });

  return MONTH_LABELS.map((month, i) => ({
    month,
    revenue: Math.round(current[i]),
    prevYear: Math.round(previous[i]),
  }));
}

/** Top variantes (por SKU) según ingresos. */
export function deriveTopProducts(orders: AdminOrder[]): TopProduct[] {
  const map = new Map<string, { sales: number; revenue: number }>();

  orders.filter(isRevenueOrder).forEach((o) => {
    o.items?.forEach((item) => {
      const key = item.variant?.sku || "—";
      const entry = map.get(key) ?? { sales: 0, revenue: 0 };
      entry.sales += item.quantity;
      entry.revenue += (Number(item.priceAtPurchase) || 0) * item.quantity;
      map.set(key, entry);
    });
  });

  return Array.from(map.entries())
    .map(([name, v]) => ({ name, sales: v.sales, revenue: Math.round(v.revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

/** Clientes derivados de las órdenes. */
export function deriveCustomers(orders: AdminOrder[]): Customer[] {
  const map = new Map<
    string,
    {
      name: string;
      email: string;
      totalOrders: number;
      totalSpent: number;
      joinedAt: string;
      hasRevenue: boolean;
    }
  >();

  orders.forEach((o) => {
    const u = o.user;
    if (!u?.id) return;
    const entry =
      map.get(u.id) ?? {
        name: `${u.name ?? ""} ${u.lastname ?? ""}`.trim() || "Cliente",
        email: u.email ?? "",
        totalOrders: 0,
        totalSpent: 0,
        joinedAt: o.createdAt,
        hasRevenue: false,
      };
    entry.totalOrders += 1;
    if (isRevenueOrder(o)) {
      entry.totalSpent += amount(o);
      entry.hasRevenue = true;
    }
    if (new Date(o.createdAt) < new Date(entry.joinedAt)) {
      entry.joinedAt = o.createdAt;
    }
    map.set(u.id, entry);
  });

  return Array.from(map.entries())
    .map(([id, v]) => ({
      id,
      name: v.name,
      email: v.email,
      totalOrders: v.totalOrders,
      totalSpent: Math.round(v.totalSpent),
      joinedAt: v.joinedAt,
      status: (v.hasRevenue ? "active" : "inactive") as Customer["status"],
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

const STATUS_DOT: Record<
  AdminOrderStatus,
  RecentActivityItem["dotColor"]
> = {
  pending: "warning",
  paid: "success",
  shipped: "accent",
  delivered: "success",
  cancelled: "muted",
};

const STATUS_TEXT: Record<AdminOrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagada",
  shipped: "Enviada",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} d`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months > 1 ? "es" : ""}`;
}

/** Órdenes recientes como feed de actividad. */
export function deriveRecentActivity(
  orders: AdminOrder[],
  limit = 6,
): RecentActivityItem[] {
  return [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit)
    .map((o) => ({
      id: o.id,
      title: `Orden #${o.orderNumber} · ${STATUS_TEXT[o.status]}`,
      timeAgo: timeAgo(o.createdAt),
      dotColor: STATUS_DOT[o.status],
    }));
}

/** KPIs de la sección Analytics (derivados de órdenes reales). */
export interface AnalyticsKpis {
  totalRevenue: number;
  paidRate: number;
  aov: number;
  totalCustomers: number;
}

export function deriveAnalyticsKpis(orders: AdminOrder[]): AnalyticsKpis {
  const revenueOrders = orders.filter(isRevenueOrder);
  const totalRevenue = revenueOrders.reduce((s, o) => s + amount(o), 0);
  const aov = revenueOrders.length ? totalRevenue / revenueOrders.length : 0;
  const paidRate = orders.length
    ? (revenueOrders.length / orders.length) * 100
    : 0;
  const totalCustomers = new Set(orders.map((o) => o.user?.id).filter(Boolean))
    .size;

  return {
    totalRevenue: Math.round(totalRevenue),
    paidRate: Number(paidRate.toFixed(1)),
    aov: Number(aov.toFixed(2)),
    totalCustomers,
  };
}
