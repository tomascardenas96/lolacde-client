"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { cartService } from "@/features/cart/services/cartService";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useToast } from "@/components/ui/Toast";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ProductReviews } from "@/features/reviews/components/ProductReviews";
import type {
  Product,
  ProductVariant,
} from "@/features/products/types/state.types";

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

export function ProductDetail({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { showToast } = useToast();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const hasMultipleVariants = variants.length > 1;
  const canAdd = !!selectedVariant && selectedVariant.stock > 0;
  const maxQty = selectedVariant?.stock ?? 0;

  const images = useMemo(() => {
    const list = (product.images ?? [])
      .slice()
      .sort((a, b) => Number(b.isMain) - Number(a.isMain) || a.order - b.order);
    return list.length > 0 ? list : null;
  }, [product.images]);

  const mainImage = images?.[activeImage]?.url ?? FALLBACK_IMAGE;
  const rating = Number(product.averageRating);
  const hasRating = Number.isFinite(rating) && rating > 0;

  const handleQty = (delta: number) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (maxQty && next > maxQty) return maxQty;
      return next;
    });
  };

  const handleAdd = async () => {
    if (!selectedVariant) return;
    if (!isAuthenticated) {
      showToast("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    setIsAdding(true);
    try {
      await cartService.addItem(selectedVariant.id, quantity);
      showToast(`${product.name} agregado al carrito`);
    } catch {
      showToast("Error al agregar al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <section className="px-6 md:px-20 lg:px-32 mb-10">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-[0.65rem] tracking-[0.15em] uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catalogo
        </Link>
      </section>

      <section className="px-6 md:px-20 lg:px-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="flex-1 lg:max-w-[55%]">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-card">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>

            {images && images.length > 1 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 h-24 overflow-hidden border transition-all ${
                      idx === activeImage
                        ? "border-white"
                        : "border-white/10 hover:border-white/40"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? `${product.name} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col">
            <p className="text-[0.6rem] tracking-[0.25em] text-muted uppercase mb-3">
              {product.category?.name}
            </p>
            <h1 className="heading-display text-4xl md:text-5xl text-white mb-4">
              {product.name}
            </h1>

            {hasRating && (
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(rating)
                          ? "fill-accent text-accent"
                          : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted">
                  {rating.toFixed(1)} ({product.totalReviews})
                </span>
              </div>
            )}

            <p className="text-2xl text-white font-light mb-8">
              ${selectedVariant ? formatPrice(selectedVariant.price) : "0"}
            </p>

            {product.description && (
              <p className="text-sm text-muted leading-relaxed max-w-md mb-8">
                {product.description}
              </p>
            )}

            {/* Variants */}
            {hasMultipleVariants && (
              <div className="mb-8">
                <p className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-3">
                  Variante
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const isSelected = variant.id === selectedVariant?.id;
                    const isOutOfStock = variant.stock <= 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          setQuantity(1);
                        }}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Sin stock" : undefined}
                        className={`px-4 py-2 text-[0.6rem] tracking-[0.15em] uppercase border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:line-through ${
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
              </div>
            )}

            {/* Quantity + Add */}
            <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-white/20">
                <button
                  type="button"
                  onClick={() => handleQty(-1)}
                  disabled={quantity <= 1}
                  className="px-4 py-3.5 text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQty(1)}
                  disabled={!!maxQty && quantity >= maxQty}
                  className="px-4 py-3.5 text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={isAdding || !canAdd}
                className="flex-1 bg-white text-black border border-white py-3.5 px-8 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-transparent hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding
                  ? "Agregando..."
                  : canAdd
                    ? "Agregar al carrito"
                    : "Sin stock"}
              </button>

              <FavoriteButton
                productId={product.id}
                className="border border-white/20 px-5 py-3.5 hover:border-white/50"
                iconClassName="w-5 h-5"
              />
            </div>

            {selectedVariant && selectedVariant.stock > 0 && (
              <p className="text-[0.6rem] tracking-[0.15em] text-muted uppercase mt-4">
                {selectedVariant.stock} disponibles
              </p>
            )}
          </div>
        </div>
      </section>

      <ProductReviews productId={product.id} />
    </main>
  );
}
