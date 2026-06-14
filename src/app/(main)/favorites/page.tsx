"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useFavoritesStore } from "@/features/favorites/store/favoritesStore";
import { favoritesService } from "@/features/favorites/services/favoritesService";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import type { Product } from "@/features/products/types/state.types";

const FALLBACK_IMAGE = "/pexels-krivitskiy-6206795.jpg";

const formatPrice = (price: string | number) => {
  const n = typeof price === "string" ? Number(price) : price;
  return Number.isFinite(n) ? n.toLocaleString("es-AR") : "0";
};

const fromPrice = (product: Product) => {
  const prices = (product.variants ?? [])
    .map((v) => Number(v.price))
    .filter((n) => Number.isFinite(n));
  return prices.length > 0 ? Math.min(...prices) : 0;
};

export default function FavoritesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const products = useFavoritesStore((s) => s.products);
  const isLoading = useFavoritesStore((s) => s.isLoading);

  useEffect(() => {
    if (isAuthenticated) {
      favoritesService.getFavorites();
    }
  }, [isAuthenticated]);

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          MIS <br /> FAVORITOS
        </h1>
      </section>

      <section className="px-6 md:px-20 lg:px-32">
        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Iniciá sesión para ver tus favoritos
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesión
            </Link>
          </div>
        ) : isLoading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-10 h-10 text-muted mx-auto mb-4" />
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Todavía no guardaste favoritos
            </p>
            <Link
              href="/catalogue"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((product) => (
              <FavoriteCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function FavoriteCard({ product }: { product: Product }) {
  const images = product.images ?? [];
  const mainImage = images.find((img) => img.isMain) ?? images[0];
  const image = mainImage?.url ?? FALLBACK_IMAGE;
  const imgSizes = "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw";

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
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        <FavoriteButton
          productId={product.id}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 backdrop-blur-sm hover:bg-black/70"
          iconClassName="w-4 h-4"
        />
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
          ${formatPrice(fromPrice(product))}
        </p>
      </div>
    </article>
  );
}
