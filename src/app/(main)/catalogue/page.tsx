"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cartService } from "@/features/cart/services/cartService";
import { productsService } from "@/features/products/services/productsService";
import { useProductsStore } from "@/features/products/store/productsStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useToast } from "@/components/ui/Toast";
import type {
  Product,
  ProductVariant,
} from "@/features/products/types/state.types";

const ALL_ITEMS = "ALL ITEMS" as const;
const FALLBACK_IMAGE = "/pexels-krivitskiy-6206795.jpg";

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
  const { products, isLoading, error } = useProductsStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_ITEMS);
  const { showToast } = useToast();

  useEffect(() => {
    productsService.getProducts();
  }, []);

  const categories = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const unique = Array.from(
      new Set(list.map((p) => p.category?.name?.toUpperCase()).filter(Boolean)),
    ) as string[];
    return [ALL_ITEMS, ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return activeFilter === ALL_ITEMS
      ? list
      : list.filter((p) => p.category?.name?.toUpperCase() === activeFilter);
  }, [products, activeFilter]);

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28 mb-16">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
          LINEA DE <br /> PRODUCTOS
        </h1>
        <p className="text-sm md:text-base text-muted max-w-lg leading-relaxed">
          Descubre nuestra exclusiva selección de productos, diseñados para
          complementar tu rutina de belleza y cuidado personal. Cada artículo ha
          sido cuidadosamente seleccionado para ofrecerte la máxima calidad y
          resultados excepcionales.
        </p>
      </section>

      {/* Filter Bar */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28 mb-12">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[0.65rem] tracking-[0.25em] text-muted uppercase font-medium">
            FILTER BY
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase font-medium border transition-all duration-300 cursor-pointer ${
                activeFilter === cat
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-muted border-white/20 hover:border-white/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28">
        {isLoading && products.length === 0 ? (
          <p className="text-muted text-sm tracking-widest uppercase">
            Cargando productos...
          </p>
        ) : error ? (
          <p className="text-red-400 text-sm tracking-widest uppercase">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-muted text-sm tracking-widest uppercase">
            No hay productos disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAuthenticated={isAuthenticated}
                showToast={showToast}
              />
            ))}
          </div>
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
    variants[0]?.id ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const hasMultipleVariants = variants.length > 1;

  const mainImage = product.images?.find((img) => img.isMain);
  const image = mainImage?.url ?? FALLBACK_IMAGE;
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

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700 group-hover:grayscale group-hover:scale-105"
        />
      </div>

      <div className="pt-5 flex flex-col flex-1">
        <p className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-1">
          {product.category?.name}
        </p>
        <h3 className="text-sm tracking-widest text-white uppercase font-semibold">
          {product.name}
        </h3>
        <p className="text-sm text-white/80 mt-1">
          ${selectedVariant ? formatPrice(selectedVariant.price) : "0"}
        </p>

        {/* Variant selector */}
        {hasMultipleVariants && (
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const isSelected = variant.id === selectedVariant?.id;
              const isOutOfStock = variant.stock <= 0;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  disabled={isOutOfStock}
                  title={isOutOfStock ? "Sin stock" : undefined}
                  className={`px-3 py-1.5 text-[0.6rem] tracking-[0.15em] uppercase border transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through ${
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

        <div className="mt-auto pt-5">
          <button
            disabled={isAdding || !canAdd}
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            className="w-full bg-white text-black border border-white py-2.5 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-transparent hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding
              ? "Agregando..."
              : canAdd
                ? "Agregar al carrito"
                : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
