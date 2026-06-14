import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AxiosError } from "axios";
import { useAddressesStore } from "../store/addressesStore";
import {
  Address,
  CreateAddressDto,
  UpdateAddressDto,
} from "../types/state.types";

const extractApiError = (error: unknown, fallback: string): string => {
  if (!(error instanceof AxiosError)) return fallback;
  const data = error.response?.data?.message;
  if (Array.isArray(data)) return data.join(" · ");
  if (typeof data === "string") return data;
  return fallback;
};

export const addressesService = {
  getAddresses: async (): Promise<void> => {
    const { setAddresses, setLoading, setError } = useAddressesStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Address[]>("/user-address");
      setAddresses(data);
      logger.info("ADDRESSES_SERVICE", `${data.length} direcciones cargadas`);
    } catch (error: unknown) {
      const msg = extractApiError(error, "Error al obtener las direcciones");
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
    } finally {
      setLoading(false);
    }
  },

  create: async (dto: CreateAddressDto): Promise<Address> => {
    const { addAddress, setError } = useAddressesStore.getState();
    try {
      const { data } = await apiClient.post<Address>("/user-address", dto);
      addAddress(data);
      logger.info("ADDRESSES_SERVICE", `Dirección creada: ${data.id}`);
      return data;
    } catch (error: unknown) {
      const msg = extractApiError(error, "Error al crear la dirección");
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
      throw error;
    }
  },

  update: async (
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<Address> => {
    const { updateAddress, setError } = useAddressesStore.getState();
    try {
      const { data } = await apiClient.patch<Address>(
        `/user-address/${addressId}`,
        dto,
      );
      updateAddress(data);
      logger.info("ADDRESSES_SERVICE", `Dirección actualizada: ${data.id}`);
      return data;
    } catch (error: unknown) {
      const msg = extractApiError(error, "Error al actualizar la dirección");
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
      throw error;
    }
  },

  setDefault: async (addressId: string): Promise<Address> => {
    const { updateAddress, setError } = useAddressesStore.getState();
    try {
      const { data } = await apiClient.patch<Address>(
        `/user-address/${addressId}/default`,
        {},
      );
      updateAddress(data);
      logger.info("ADDRESSES_SERVICE", `Dirección predeterminada: ${data.id}`);
      return data;
    } catch (error: unknown) {
      const msg = extractApiError(
        error,
        "Error al marcar la dirección como predeterminada",
      );
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
      throw error;
    }
  },

  remove: async (addressId: string): Promise<void> => {
    const { removeAddress, setError } = useAddressesStore.getState();
    try {
      await apiClient.delete(`/user-address/${addressId}`);
      removeAddress(addressId);
      logger.info("ADDRESSES_SERVICE", `Dirección eliminada: ${addressId}`);
    } catch (error: unknown) {
      const msg = extractApiError(error, "Error al eliminar la dirección");
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
      throw error;
    }
  },
};
