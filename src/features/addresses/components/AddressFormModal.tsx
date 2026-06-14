"use client";

import { Button, Input, Modal, Switch } from "@/components/ui";
import { useAddressForm } from "../hooks/useAddressForm";
import { Address } from "../types/state.types";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Dirección a editar. Si se omite, el formulario crea una nueva. */
  address?: Address;
  onSuccess?: (address: Address) => void;
}

export function AddressFormModal({ open, onClose, address, onSuccess }: Props) {
  const { form, serverError, isLoading, isEdit, onSubmit } = useAddressForm({
    address,
    onSuccess: (saved) => {
      onSuccess?.(saved);
      onClose();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={isEdit ? "Editar" : "Nueva"}
      title={isEdit ? "Editar dirección" : "Agregar dirección"}
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="address-form"
            variant="primary"
            loading={isLoading}
          >
            {isEdit ? "Guardar cambios" : "Agregar dirección"}
          </Button>
        </>
      }
    >
      <form id="address-form" onSubmit={onSubmit} className="space-y-5">
        <Input
          label="Domicilio"
          placeholder="Calle 7 nro 123, piso 4 dto B"
          error={errors.addressLine?.message}
          {...register("addressLine")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Ciudad"
            placeholder="La Plata"
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label="Provincia / Estado"
            placeholder="Buenos Aires"
            error={errors.state?.message}
            {...register("state")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="País"
            placeholder="Argentina"
            error={errors.country?.message}
            {...register("country")}
          />
          <Input
            label="Código postal (opcional)"
            placeholder="1900"
            error={errors.zipCode?.message}
            {...register("zipCode")}
          />
        </div>

        <div className="pt-2">
          <Switch
            label="Usar como dirección predeterminada"
            description="Se seleccionará automáticamente al finalizar tus compras."
            {...register("isDefault")}
          />
        </div>

        {serverError && (
          <p className="text-xs text-danger tracking-wide">{serverError}</p>
        )}
      </form>
    </Modal>
  );
}
