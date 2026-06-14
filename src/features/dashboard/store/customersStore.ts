import { create } from "zustand";
import type { Customer } from "../types/dashboard.types";

interface CustomersState {
  customers: Customer[];
  total: number;
  isLoading: boolean;
  error: string | null;

  setCustomers: (customers: Customer[], total: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCustomersStore = create<CustomersState>()((set) => ({
  customers: [],
  total: 0,
  isLoading: false,
  error: null,

  setCustomers: (customers, total) => set({ customers, total, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
