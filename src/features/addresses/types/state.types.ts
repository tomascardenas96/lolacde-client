// --- API response types ---

export interface Address {
  id: string;
  country: string;
  state: string;
  city: string;
  addressLine: string;
  zipCode?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  country: string;
  state: string;
  city: string;
  addressLine: string;
  zipCode?: string;
  isDefault?: boolean;
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

// --- Store state ---

export interface AddressesState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
