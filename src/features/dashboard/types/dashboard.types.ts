export interface OverviewStats {
  netRevenue: number;
  netRevenueTrend: number;
  totalOrders: number;
  totalOrdersLabel: string;
  activeClients: number;
  activeClientsTrend: number;
  aov: number;
  aovTrend: number;
}

export interface MarketPerformance {
  month: string;
  sales: number;
  projections: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  timeAgo: string;
  dotColor: "accent" | "muted" | "success" | "warning";
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "draft" | "archived";
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "inactive";
}

export type OrderStatus = "pending" | "processing" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  prevYear: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export interface AnalyticsOverview {
  conversionRate: number;
  conversionTrend: number;
  avgSessionDuration: string;
  bounceRate: number;
  bounceTrend: number;
  totalVisitors: number;
  visitorsTrend: number;
}

export interface StatCardProps {
  label: string;
  value: string;
  badge?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

// --- Stats del backend (GET /orders/admin/stats) ---

export interface DashboardStatsTopProduct {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface DashboardStatsMonthlyPoint {
  month: string; // 'YYYY-MM'
  revenue: number;
  orderCount: number;
}

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  topProducts: DashboardStatsTopProduct[];
  monthly: DashboardStatsMonthlyPoint[];
}

// --- Clientes del backend (GET /user) ---

export interface ServerCustomer {
  id: string;
  name: string;
  lastname: string | null;
  email: string;
  createdAt: string;
  isEmailConfirmed: boolean;
  roleName: string | null;
  ordersCount: number;
  totalSpent: number;
}

export interface CustomersResponse {
  data: ServerCustomer[];
  total: number;
}
