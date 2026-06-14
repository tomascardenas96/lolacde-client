"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cartService } from "@/features/cart/services/cartService";
import { productsService } from "@/features/products/services/productsService";
import { useProductsStore } from "@/features/products/store/productsStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { categoriesService } from "@/features/categories/services/categoriesService";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { useToast } from "@/components/ui/Toast";
import type { Category } from "@/features/categories/types/state.types";
import type {
  Product,
  ProductVariant,
} from "@/features/products/types/state.types";

const ALL_ITEMS = "ALL ITEMS" as const;
const FALLBACK_IMAGE = "/pexels-krivitskiy-6206795.jpg";
const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 400;

const formatPrice = (price: string | number) => {
  const n = typeof price === "string" ? Number(price) : price;
  return Number.isFinite(n) ? n.toLocaleString("es-AR") : "0";
};

const variantLabel = (variant: ProductVariant) => {
  const attrs = variant.attributes;
  if (attrs && Object.keys(attrs).length > 0) {
    return Object.values(attrs).join(" / ");
  }
  return variant.sku;
};

export default function CataloguePage() {
  const { products, total, isLoading, error } = useProductsStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  // Categorías reales desde la API (para filtrar por ID server-side).
  useEffect(() => {
    categoriesService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Debounce de la búsqueda: evita disparar una request por tecla.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  // Búsqueda, filtro y paginación server-side.
  useEffect(() => {
    productsService.getProducts({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
      ...(activeCategoryId ? { categoryId: activeCategoryId } : {}),
    });
  }, [debouncedQuery, activeCategoryId, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const handleFilter = (categoryId: string | null) => {
    setActiveCategoryId(categoryId);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="relative px-6 md:px-20 lg:px-24 2xl:px-28 mb-16">
        <div className="glow-accent absolute inset-x-0 -top-28 h-72 pointer-events-none" />
        <h1 className="heading-display relative text-5xl md:text-7xl lg:text-8xl text-white mb-6">
          LINEA DE <br /> PRODUCTOS
        </h1>
        <p className="text-sm md:text-base text-muted max-w-lg leading-relaxed">
          Descubre nuestra exclusiva selección de productos, diseñados para
          complementar tu rutina de belleza y cuidado personal. Cada artículo ha
          sido cuidadosamente seleccionado para ofrecerte la máxima calidad y
          resultados excepcionales.
        </p>
      </section>

      {/* Search */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-transparent border-b border-white/10 py-3 pl-7 text-sm text-white outline-none focus:border-white/40 transition-colors placeholder:text-muted/40"
          />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28 mb-12">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[0.65rem] tracking-[0.25em] text-muted uppercase font-medium">
            FILTER BY
          </span>
          <button
            onClick={() => handleFilter(null)}
            className={`px-6 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase font-medium border transition-all duration-300 cursor-pointer ${
              activeCategoryId === null
                ? "bg-white text-black border-white"
                : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
            }`}
          >
            {ALL_ITEMS}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`px-6 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase font-medium border transition-all duration-300 cursor-pointer ${
                activeCategoryId === cat.id
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28">
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm tracking-widest uppercase">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="text-muted text-sm tracking-widest uppercase">
            No hay productos disponibles.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAuthenticated={isAuthenticated}
                  showToast={showToast}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase border border-white/20 text-muted hover:border-white/50 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 text-[0.65rem] tracking-[0.1em] border transition-all cursor-pointer ${
                        pageNum === currentPage
                          ? "bg-white text-black border-white"
                          : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase border border-white/20 text-muted hover:border-white/50 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

interface ProductCardProps {
  product: Product;
  isAuthenticated: boolean;
  showToast: (message: string) => void;
}

function ProductCard({ product, isAuthenticated, showToast }: ProductCardProps) {
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.find((v) => v.stock > 0)?.id ?? variants[0]?.id ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const hasMultipleVariants = variants.length > 1;
  const inStock = variants.some((v) => v.stock > 0);

  const images = product.images ?? [];
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const image = mainImage?.url ?? FALLBACK_IMAGE;
  const hoverImage = images.find((img) => img.url !== image);
  const canAdd = !!selectedVariant && selectedVariant.stock > 0;

  const handleAdd = async () => {
    if (!selectedVariant) return;
    if (!isAuthenticated) {
      showToast("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    setIsAdding(true);
    try {
      await cartService.addItem(selectedVariant.id, 1);
      showToast(`${product.name} agregado al carrito`);
    } catch {
      showToast("Error al agregar al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  const imgSizes =
    "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw";

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-surface-1">
        <Link
          href={`/catalogue/${product.slug}`}
          className="absolute inset-0 block"
        >
          <Image
            src={image}
            alt={mainImage?.alt ?? product.name}
            fill
            sizes={imgSizes}
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              hoverImage ? "group-hover:opacity-0" : ""
            } ${!inStock ? "grayscale opacity-50" : ""}`}
          />
          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt={hoverImage.alt ?? product.name}
              fill
              sizes={imgSizes}
              className={`object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105 ${
                !inStock ? "grayscale opacity-50" : ""
              }`}
            />
          )}
        </Link>

        {!inStock && (
          <span className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-sm text-white text-[0.5rem] tracking-[0.2em] uppercase px-2.5 py-1">
            Agotado
          </span>
        )}

        <FavoriteButton
          productId={product.id}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 backdrop-blur-sm hover:bg-black/70"
          iconClassName="w-4 h-4"
        />

        {/* Quick add — slides up on hover/focus (desktop), always shown on touch */}
        {inStock && (
          <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:pointer-events-auto">
            <button
              disabled={isAdding || !canAdd}
              onClick={(e) => {
                e.stopPropagation();
                handleAdd();
              }}
              className="w-full bg-white text-black py-2 text-[0.6rem] tracking-[0.2em] uppercase font-semibold hover:bg-accent transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Agregando..." : "Agregar al carrito"}
            </button>
          </div>
        )}
      </div>

      <div className="pt-3 flex flex-col flex-1">
        <p className="text-[0.55rem] tracking-[0.2em] text-muted uppercase mb-1">
          {product.category?.name}
        </p>
        <Link href={`/catalogue/${product.slug}`}>
          <h3 className="text-xs tracking-[0.12em] text-white uppercase font-semibold hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-white/70 mt-1">
          ${selectedVariant ? formatPrice(selectedVariant.price) : "0"}
        </p>

        {/* Variant selector */}
        {hasMultipleVariants && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedVariant?.id;
              const isOutOfStock = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={isOutOfStock}
                  title={isOutOfStock ? "Sin stock" : undefined}
                  className={`px-2 py-1 text-[0.55rem] tracking-[0.12em] uppercase border transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through ${
                    isSelected
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {variantLabel(variant)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-4/5 w-full skeleton" />
      <div className="pt-3 flex flex-col gap-2">
        <div className="skeleton h-2 w-1/3" />
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-2.5 w-1/4" />
      </div>
    </div>
  );
}
