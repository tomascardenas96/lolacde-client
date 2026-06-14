import { create } from "zustand";
import { Address, AddressesState } from "../types/state.types";

export const useAddressesStore = create<AddressesState>()((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  setAddresses: (addresses) => set({ addresses, error: null }),

  addAddress: (address) =>
    set({ addresses: applyDefault([address, ...get().addresses], address) }),

  updateAddress: (address) =>
    set({
      addresses: applyDefault(
        get().addresses.map((a) => (a.id === address.id ? address : a)),
        address,
      ),
    }),

  removeAddress: (addressId) =>
    set({ addresses: get().addresses.filter((a) => a.id !== addressId) }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

/**
 * El backend garantiza una única dirección predeterminada. Cuando la dirección
 * recién creada/actualizada queda como default, desmarcamos el resto localmente
 * para que la UI no muestre dos predeterminadas hasta el próximo fetch.
 */
function applyDefault(addresses: Address[], changed: Address): Address[] {
  if (!changed.isDefault) return addresses;
  return addresses.map((a) =>
    a.id !== changed.id && a.isDefault ? { ...a, isDefault: false } : a,
  );
}
