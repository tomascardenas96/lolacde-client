// --- API response types ---

export interface VariantAttributes {
  [key: string]: string;
}

export interface CartItemProductImage {
  url: string;
  alt: string | null;
  isMain: boolean;
}

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  images?: CartItemProductImage[];
}

export interface CartItemVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: VariantAttributes;
  product: CartItemProduct;
}

export interface CartItem {
  id: string;
  unitPrice: number;
  quantity: number;
  variant: CartItemVariant;
}

export interface Cart {
  id: string;
  status: "open" | "ordered";
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// --- Store state ---

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  setCart: (cart: Cart) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCart: () => void;
}
