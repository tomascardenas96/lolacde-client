"use client";

import { Modal, Input, Select, Button } from "@/components/ui";
import { useCategoriesStore } from "../store/categoriesStore";
import { useCategoryForm } from "../hooks/useCategoryForm";
import { Category } from "../types/state.types";

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category;
  onSuccess: () => void;
}

export function CategoryFormModal({ open, onClose, category, onSuccess }: Props) {
  const categories = useCategoriesStore((s) => s.categories);

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  const { form, isLoading, serverError, onSubmit } = useCategoryForm({
    category,
    onSuccess: handleSuccess,
  });

  const {
    register,
    formState: { errors },
  } = form;

  const parentOptions = categories.filter((c) => c.id !== category?.id);
  const isEditing = !!category;

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow={isEditing ? "Editar" : "Nueva"}
      title={isEditing ? "Editar categoría" : "Nueva categoría"}
      size="sm"
      closeOnBackdrop={!isLoading}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            loading={isLoading}
            onClick={onSubmit}
            type="button"
          >
            {isEditing ? "Guardar cambios" : "Crear categoría"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label="Nombre"
          placeholder="Ej. Ropa deportiva"
          error={errors.name?.message}
          {...register("name")}
        />

        <Select
          label="Categoría padre"
          error={errors.parentId?.message}
          {...register("parentId")}
        >
          <option value="">Sin categoría padre</option>
          {parentOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        {serverError && (
          <p className="text-xs text-danger border border-danger/20 bg-danger/5 px-4 py-3">
            {serverError}
          </p>
        )}
      </div>
    </Modal>
  );
}
