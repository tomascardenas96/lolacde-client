import { create } from "zustand";
import { FavoritesState } from "../types/state.types";

export const useFavoritesStore = create<FavoritesState>()((set) => ({
  ids: [],
  products: [],
  isLoading: false,
  isLoaded: false,

  setFavorites: (products) =>
    set({ products, ids: products.map((p) => p.id), isLoaded: true }),

  addId: (id) =>
    set((state) =>
      state.ids.includes(id) ? state : { ids: [...state.ids, id] },
    ),

  removeId: (id) =>
    set((state) => ({
      ids: state.ids.filter((x) => x !== id),
      products: state.products.filter((p) => p.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  clear: () => set({ ids: [], products: [], isLoaded: false }),
}));
