import { create } from "zustand";
import { CategoriesState } from "../types/state.types";

export const useCategoriesStore = create<CategoriesState>()((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  setCategories: (categories) => set({ categories, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
