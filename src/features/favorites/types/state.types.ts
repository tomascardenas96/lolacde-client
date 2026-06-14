import type { Product } from "@/features/products/types/state.types";

export interface FavoritesState {
  // IDs de productos favoritos — fuente de verdad para el estado del corazón.
  ids: string[];
  // Productos completos — para renderizar la página /favorites.
  products: Product[];
  isLoading: boolean;
  isLoaded: boolean;

  setFavorites: (products: Product[]) => void;
  addId: (id: string) => void;
  removeId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}
