import { create } from "zustand";
import type { DashboardStats } from "../types/dashboard.types";

interface StatsState {
  stats: DashboardStats | null;
  customerCount: number;
  isLoading: boolean;
  error: string | null;

  setStats: (stats: DashboardStats) => void;
  setCustomerCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStatsStore = create<StatsState>()((set) => ({
  stats: null,
  customerCount: 0,
  isLoading: false,
  error: null,

  setStats: (stats) => set({ stats, error: null }),
  setCustomerCount: (customerCount) => set({ customerCount }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
