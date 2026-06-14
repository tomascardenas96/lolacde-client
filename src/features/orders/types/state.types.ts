import { CartItem } from "@/features/cart/types/state.types";

// --- API response types ---

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface OrderAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderShippingMethod {
  id: string;
  name: string;
  price: string;
  estimatedDays: string;
}

export interface OrderShipment {
  id: string;
  status: string;
  method?: OrderShippingMethod | null;
}

export interface OrderDiscount {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount";
  value: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: OrderAddress;
  receiverName: string;
  phone: string;
  additionalInfo?: string;
  // Montos (decimales serializados como string por el backend)
  subtotalAmount?: string;
  shippingAmount?: string;
  discountAmount?: string;
  totalAmount?: string;
  shipment?: OrderShipment | null;
  discount?: OrderDiscount | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentResponse {
  paymentId: string;
  redirectUrl?: string;
  clientSecret?: string;
  providerPaymentId: string;
}

export interface CheckoutPayload {
  addressId: string;
  receiverName: string;
  phone: string;
  additionalInfo?: string;
  shippingMethodId?: string;
  discountCode?: string;
}

export interface PayPayload {
  provider: string;
}

// --- Store state ---

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
