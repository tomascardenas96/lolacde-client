"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { logger } from "@/lib/logger";
import { getApiErrorMessage } from "@/lib/error-utils";
import { AddressFormValues, addressSchema } from "../schemas/address.schema";
import { addressesService } from "../services/addressesService";
import { Address, CreateAddressDto } from "../types/state.types";

interface UseAddressFormOptions {
  /** Si se pasa una dirección, el formulario opera en modo edición. */
  address?: Address;
  onSuccess?: (address: Address) => void;
}

const CREATE_DEFAULTS: AddressFormValues = {
  country: "",
  state: "",
  city: "",
  addressLine: "",
  zipCode: "",
  isDefault: false,
};

const toFormValues = (address: Address): AddressFormValues => ({
  country: address.country,
  state: address.state,
  city: address.city,
  addressLine: address.addressLine,
  zipCode: address.zipCode ?? "",
  isDefault: address.isDefault,
});

export const useAddressForm = ({
  address,
  onSuccess,
}: UseAddressFormOptions = {}) => {
  const isEdit = Boolean(address);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const defaults = address ? toFormValues(address) : CREATE_DEFAULTS;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaults,
  });

  const onSubmit = (values: AddressFormValues) => {
    startTransition(async () => {
      setServerError(null);
      const dto: CreateAddressDto = {
        country: values.country.trim(),
        state: values.state.trim(),
        city: values.city.trim(),
        addressLine: values.addressLine.trim(),
        isDefault: values.isDefault,
      };
      const zip = values.zipCode?.trim();
      if (zip) dto.zipCode = zip;

      try {
        let result: Address;
        if (address) {
          logger.info("ADDRESS_FORM", "Actualizando dirección", address.id);
          result = await addressesService.update(address.id, dto);
        } else {
          logger.info("ADDRESS_FORM", "Creando dirección");
          result = await addressesService.create(dto);
          form.reset(CREATE_DEFAULTS);
        }
        onSuccess?.(result);
      } catch (err: unknown) {
        const status =
          err instanceof AxiosError ? err.response?.status : undefined;
        let fallback = isEdit
          ? "No se pudo actualizar la dirección"
          : "No se pudo crear la dirección";
        if (status === 404) fallback = "La dirección ya no existe";
        else if (status === 400) fallback = "Revisá los datos ingresados";
        const msg = getApiErrorMessage(err, fallback);
        setServerError(msg);
        logger.error("ADDRESS_FORM", "Fallo al guardar dirección", err);
      }
    });
  };

  const reset = () => {
    form.reset(defaults);
    setServerError(null);
  };

  return {
    form,
    serverError,
    isLoading: isPending,
    isEdit,
    onSubmit: form.handleSubmit(onSubmit),
    reset,
  };
};
