import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { useAddressesStore } from "../store/addressesStore";
import {
  Address,
  CreateAddressDto,
  UpdateAddressDto,
} from "../types/state.types";

export const addressesService = {
  getAddresses: async (): Promise<void> => {
    const { setAddresses, setLoading, setError } = useAddressesStore.getState();
    try {
      setLoading(true);
      const { data } = await apiClient.get<Address[]>("/user-address");
      setAddresses(data);
      logger.info("ADDRESSES_SERVICE", `${data.length} direcciones cargadas`);
    } catch (error: unknown) {
      const msg = getApiErrorMessage(error, "No se pudieron cargar las direcciones");
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
      const msg = getApiErrorMessage(error, "No se pudo crear la dirección");
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
      const msg = getApiErrorMessage(error, "No se pudo actualizar la dirección");
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
      const msg = getApiErrorMessage(
        error,
        "No se pudo marcar la dirección como predeterminada",
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
      const msg = getApiErrorMessage(error, "No se pudo eliminar la dirección");
      setError(msg);
      logger.error("ADDRESSES_SERVICE", msg, error);
      throw error;
    }
  },
};
