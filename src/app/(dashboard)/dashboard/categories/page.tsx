"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Search, Trash2, X } from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { useCategoriesStore } from "@/features/categories/store/categoriesStore";
import { categoriesService } from "@/features/categories/services/categoriesService";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import { useToast } from "@/components/ui/Toast";
import { getApiErrorMessage } from "@/lib/error-utils";
import type { Category } from "@/features/categories/types/state.types";
import type { Column } from "@/features/dashboard/types/dashboard.types";

export default function CategoriesPage() {
  const categories = useCategoriesStore((s) => s.categories);
  const isLoading = useCategoriesStore((s) => s.isLoading);
  const error = useCategoriesStore((s) => s.error);
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    categoriesService.loadCategories();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(term));
  }, [categories, search]);

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await categoriesService.deleteCategory(pendingDelete.id);
      showToast(`${pendingDelete.name} eliminada`);
      setPendingDelete(null);
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err, "No se pudo eliminar la categoría"));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Category>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Nombre",
        render: (item) => <span className="font-medium">{item.name}</span>,
      },
      {
        key: "slug",
        label: "Slug",
        render: (item) => (
          <span className="font-mono text-xs text-muted">{item.slug}</span>
        ),
      },
      {
        key: "parent",
        label: "Categoría padre",
        render: (item) => item.parent?.name ?? "—",
      },
      {
        key: "productCount",
        label: "Productos",
        render: (item) => (
          <span className="text-muted">{item.productCount ?? 0}</span>
        ),
      },
      {
        key: "actions",
        label: "",
        render: (item) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => openEdit(item)}
              aria-label={`Editar ${item.name}`}
              className="p-2 rounded-sm text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete(item)}
              aria-label={`Eliminar ${item.name}`}
              className="p-2 rounded-sm text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="max-w-[1400px]">
      <DashboardHeader
        title="Categorías"
        subtitle="Gestión de categorías"
        actions={
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm cursor-pointer"
          >
            Agregar categoría
          </button>
        }
      />

      {/* Buscador */}
      <div className="flex mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card text-white text-sm pl-10 pr-4 py-2.5 rounded-sm outline-none placeholder:text-muted/60 focus:ring-1 focus:ring-white/20"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-card rounded-sm">
        {isLoading && categories.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 text-muted animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-danger">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            {search ? "No se encontraron categorías" : "No hay categorías aún"}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(item) => item.id}
          />
        )}
      </div>

      {/* Modales alta / edición */}
      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editing}
        onSuccess={() =>
          showToast(editing ? "Categoría actualizada" : "Categoría creada")
        }
      />

      {/* Confirmación de borrado */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !isDeleting && setPendingDelete(null)}
        >
          <div
            className="relative w-full max-w-md bg-card border border-white/10 rounded-sm p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              disabled={isDeleting}
              aria-label="Cerrar"
              className="absolute top-4 right-4 text-muted hover:text-white transition-colors cursor-pointer disabled:opacity-30"
            >
              <X size={16} />
            </button>

            <p className="text-[0.6rem] tracking-[0.25em] text-danger uppercase mb-3">
              Eliminar categoría
            </p>
            <h3 className="text-xl text-white font-light mb-2">
              ¿Eliminar {pendingDelete.name}?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-8">
              Solo se puede eliminar si la categoría no tiene productos ni
              subcategorías asociadas.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 text-[0.65rem] tracking-[0.2em] uppercase text-muted hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-danger text-white text-[0.65rem] tracking-[0.2em] uppercase hover:bg-danger/90 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2 rounded-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Eliminando
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
