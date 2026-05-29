"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { StatusBadge } from "@/features/dashboard/components/StatusBadge";
import { useProductsStore } from "@/features/products/store/productsStore";
import { productsService } from "@/features/products/services/productsService";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/features/products/types/state.types";
import type { Column } from "@/features/dashboard/types/dashboard.types";

const PAGE_SIZE = 10;

const FALLBACK_IMAGE = "/pexels-krivitskiy-6206795.jpg";

const parsePrice = (price: string | number) =>
  typeof price === "number" ? price : Number(price) || 0;

const getMainImage = (product: Product): string => {
  const main = product.images?.find((img) => img.isMain);
  return main?.url ?? product.images?.[0]?.url ?? FALLBACK_IMAGE;
};

const getPriceLabel = (product: Product): string => {
  const prices = product.variants.map((v) => parsePrice(v.price));
  if (prices.length === 0) return "$0";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `$${min.toLocaleString("en-US")}`;
  return `$${min.toLocaleString("en-US")} – $${max.toLocaleString("en-US")}`;
};

const getTotalStock = (product: Product): number =>
  product.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0);

const getSkuLabel = (product: Product): string => {
  if (product.variants.length === 0) return "—";
  if (product.variants.length === 1) return product.variants[0].sku;
  return `${product.variants[0].sku} (+${product.variants.length - 1})`;
};

export default function InventoryPage() {
  const products = useProductsStore((s) => s.products);
  const total = useProductsStore((s) => s.total);
  const isLoading = useProductsStore((s) => s.isLoading);
  const error = useProductsStore((s) => s.error);
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    productsService.getProducts({ limit: PAGE_SIZE, offset: page * PAGE_SIZE });
  }, [page]);

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(
          products.map((p) => p.category?.name).filter(Boolean) as string[],
        ),
      ),
    ],
    [products],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.variants.some((v) => v.sku.toLowerCase().includes(term));
      const matchesCategory =
        categoryFilter === "all" || p.category?.name === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showingFrom = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const showingTo = Math.min((page + 1) * PAGE_SIZE, total);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await productsService.deleteProduct(pendingDelete.id);
      showToast(`${pendingDelete.name} eliminado`);
      setPendingDelete(null);
    } catch {
      showToast("No se pudo eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Product",
        render: (item) => {
          const image = getMainImage(item);
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-sm bg-card-light shrink-0 overflow-hidden">
                <Image
                  src={image}
                  alt={item.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{item.name}</span>
            </div>
          );
        },
      },
      {
        key: "sku",
        label: "SKU",
        render: (item) => (
          <span className="font-mono text-xs">{getSkuLabel(item)}</span>
        ),
      },
      {
        key: "price",
        label: "Price",
        render: (item) => getPriceLabel(item),
      },
      {
        key: "stock",
        label: "Stock",
        render: (item) => {
          const stock = getTotalStock(item);
          return (
            <span className={stock === 0 ? "text-danger" : ""}>{stock}</span>
          );
        },
      },
      {
        key: "category",
        label: "Category",
        render: (item) => item.category?.name ?? "—",
      },
      {
        key: "status",
        label: "Status",
        render: (item) => (
          <StatusBadge status={item.isActive ? "active" : "archived"} />
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
            <Link
              href={`/dashboard/inventory/${item.id}/edit`}
              aria-label={`Editar ${item.name}`}
              className="p-2 rounded-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <Pencil size={14} />
            </Link>
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
        title="Inventory"
        subtitle="Product Management"
        actions={
          <Link
            href="/dashboard/inventory/new"
            className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors rounded-sm"
          >
            Add Product
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card text-white text-sm pl-10 pr-4 py-2.5 rounded-sm outline-none placeholder:text-muted/60 focus:ring-1 focus:ring-white/20"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-card text-white text-sm px-4 py-2.5 rounded-sm outline-none appearance-none cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-sm">
        {isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 text-muted animate-spin" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-danger">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">
            No products found
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(item) => item.id}
            renderExpanded={(item) => (
              <div className="px-6 pb-8 py-5 bg-background/40 border-t border-white/5">
                <p className="text-[0.6rem] tracking-[0.25em] text-muted uppercase mb-4">
                  Variantes · {item.variants.length}
                </p>
                {item.variants.length === 0 ? (
                  <p className="text-xs text-muted italic">
                    Este producto no tiene variantes registradas.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {item.variants.map((variant) => {
                      const stock = variant.stock ?? 0;
                      return (
                        <div
                          key={variant.id}
                          className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 px-4 bg-card rounded-sm"
                        >
                          <span className="font-mono text-xs text-white/90 min-w-[140px]">
                            {variant.sku}
                          </span>
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {variant.attributes &&
                            Object.keys(variant.attributes).length > 0 ? (
                              Object.entries(variant.attributes).map(
                                ([key, value]) => (
                                  <span
                                    key={key}
                                    className="inline-block px-2 py-0.5 bg-card-light rounded-sm text-[0.65rem] tracking-[0.05em] text-white/70 uppercase"
                                  >
                                    {key}: {value}
                                  </span>
                                ),
                              )
                            ) : (
                              <span className="text-[0.65rem] text-muted italic">
                                Sin atributos
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-xs">
                            <span className="text-white/80">
                              $
                              {parsePrice(variant.price).toLocaleString(
                                "en-US",
                              )}
                            </span>
                            <span
                              className={`tracking-widest uppercase text-[0.65rem] ${
                                stock === 0
                                  ? "text-danger"
                                  : stock <= 3
                                    ? "text-warning"
                                    : "text-muted"
                              }`}
                            >
                              {stock} en stock
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          />
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-[0.65rem] tracking-[0.15em] text-muted uppercase">
            Showing {showingFrom}–{showingTo} of {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
              className="p-2 rounded-sm bg-card hover:bg-card-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} className="text-white" />
            </button>
            <span className="text-xs text-white/80 px-2">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
              className="p-2 rounded-sm bg-card hover:bg-card-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
              Eliminar producto
            </p>
            <h3 className="text-xl text-white font-light mb-2">
              ¿Eliminar {pendingDelete.name}?
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-8">
              Esta acción ocultará el producto del catálogo. Las órdenes
              existentes no se verán afectadas.
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
