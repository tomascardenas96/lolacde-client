// --- API response types ---

export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface AdminOrderUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
}

export interface AdminOrderAddress {
  receiverName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string;
}

export interface AdminOrderItemVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface AdminOrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  variant: AdminOrderItemVariant;
}

export interface AdminOrderPayment {
  id: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  transactionId: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: AdminOrderStatus;
  totalAmount: number;
  discountAmount: number;
  createdAt: string;
  user: AdminOrderUser;
  shippingAddress: AdminOrderAddress;
  items: AdminOrderItem[];
  payments?: AdminOrderPayment[];
}

export interface AdminOrdersResponse {
  data: AdminOrder[];
  total: number;
}

export interface AdminOrdersQuery {
  limit?: number;
  offset?: number;
  status?: AdminOrderStatus;
  // Varios estados a la vez (p. ej. la pestaña "Todas"). Tiene prioridad
  // sobre `status` en el backend.
  statuses?: AdminOrderStatus[];
}

// Valid status transitions.
// `pending` solo admite cancelarse: el pase a `paid` lo hace el webhook de
// MercadoPago automaticamente, nunca manualmente desde el dashboard.
// Flujo del admin simplificado: pagada -> entregada (o cancelar). El estado
// `shipped` se mantiene solo para ordenes antiguas que ya estuvieran ahi.
export const STATUS_TRANSITIONS: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  pending: ["cancelled"],
  paid: ["delivered", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

// --- Store state ---

export interface AdminOrdersState {
  orders: AdminOrder[];
  total: number;
  selectedOrder: AdminOrder | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  setOrders: (orders: AdminOrder[], total: number) => void;
  setSelectedOrder: (order: AdminOrder | null) => void;
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) => void;
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setError: (error: string | null) => void;
}
