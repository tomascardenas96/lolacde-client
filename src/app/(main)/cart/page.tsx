"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/features/cart/store/cartStore";
import { cartService } from "@/features/cart/services/cartService";
import { useProductsStore } from "@/features/products/store/productsStore";
import { productsService } from "@/features/products/services/productsService";
import { ShieldCheck, Truck, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function CartPage() {
  const cart = useCartStore((s) => s.cart);
  const isLoading = useCartStore((s) => s.isLoading);
  const error = useCartStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const products = useProductsStore((s) => s.products);

  useEffect(() => {
    if (isAuthenticated) {
      cartService.getCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (products.length === 0) {
      productsService.getProducts({ limit: 100 });
    }
  }, [products.length]);

  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const [pendingItems, setPendingItems] = useState<Set<string>>(new Set());

  // Ejecuta una mutación sobre un item evitando peticiones duplicadas
  // (doble click / clicks rápidos), que dejarían un request apuntando a un
  // item ya eliminado y devolverían 404 "Cart item not found".
  const runItemMutation = async (
    itemId: string,
    mutate: () => Promise<void>,
  ) => {
    if (pendingItems.has(itemId)) return;
    setPendingItems((prev) => new Set(prev).add(itemId));
    try {
      await mutate();
    } finally {
      setPendingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) =>
    runItemMutation(itemId, () =>
      quantity <= 0
        ? cartService.removeItem(itemId)
        : cartService.updateItemQuantity(itemId, quantity),
    );

  const handleRemoveItem = (itemId: string) =>
    runItemMutation(itemId, () => cartService.removeItem(itemId));

  const formatAttributes = (attrs: Record<string, string>) =>
    Object.entries(attrs)
      .map(
        ([key, value]) =>
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
      )
      .join(" / ");

  return (
    <main className="min-h-screen bg-background pt-40 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28 mb-12">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          CARRITO DE <br /> COMPRAS
        </h1>
        <p className="text-[0.7rem] tracking-[0.25em] text-muted uppercase">
          {itemCount} productos en tu carrito
        </p>
      </section>

      {/* Content */}
      <section className="px-6 md:px-20 lg:px-24 2xl:px-28">
        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-widest uppercase mb-6">
              Inicia sesion para ver tu carrito
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-widest text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesion
            </Link>
          </div>
        ) : isLoading && !cart ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : error && !cart ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm tracking-widest uppercase">
              {error}
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-34 flex flex-col justify-center items-center gap-6">
            <p className="text-muted text-sm tracking-widest uppercase">
              Tu carrito esta vacio
            </p>
            <Link
              href="/catalogue"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Explorar catalogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-40">
            {/* Cart Items */}
            <div className="flex-1">
              {items.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <div className="border-t border-white/10" />}
                  <div className="py-8 flex gap-6">
                    {/* Thumbnail */}
                    {(() => {
                      const productId = item.variant?.product?.id;
                      const fullProduct = products.find(
                        (p) => p.id === productId,
                      );
                      const mainImage =
                        fullProduct?.images?.find((img) => img.isMain) ??
                        fullProduct?.images?.[0];
                      return mainImage ? (
                        <div className="w-20 h-24 shrink-0 overflow-hidden bg-card">
                          <Image
                            src={mainImage.url}
                            alt={
                              mainImage.alt ?? item.variant?.product?.name ?? ""
                            }
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-24 shrink-0 bg-card" />
                      );
                    })()}

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm md:text-base font-semibold tracking-widest` text-white uppercase">
                            {item?.variant?.product?.name}
                          </h3>
                          <p className="text-xs tracking-widest` text-muted uppercase mt-1">
                            {item?.variant?.attributes
                              ? formatAttributes(item.variant.attributes)
                              : "Sin atributos"}
                          </p>
                          {item?.unitPrice !== item?.variant?.price && (
                            <p className="text-[0.6rem] tracking-widest` text-accent mt-1">
                              Precio actual: $
                              {item?.variant?.price.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={pendingItems.has(item.id)}
                          className="text-muted hover:text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 select-none">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={pendingItems.has(item.id)}
                            className="text-[2rem] tracking-[0.15em] text-muted hover:text-white transition-colors cursor-pointer uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <span className="text-sm text-white font-medium w-6 text-center">
                            {String(item.quantity).padStart(2, "0")}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              pendingItems.has(item.id) ||
                              item.quantity >= item.variant?.stock
                            }
                            className="text-[2rem] tracking-[0.15em] text-muted hover:text-white transition-colors cursor-pointer uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Stock indicator */}
                        {item?.variant?.stock <= 3 && (
                          <span className="text-[0.6rem] tracking-widest text-accent uppercase">
                            {item?.variant?.stock} disponibles
                          </span>
                        )}

                        {/* Price */}
                        <p className="text-base md:text-lg text-white font-light">
                          $
                          {(item.unitPrice * item.quantity).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10" />
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="bg-card p-8">
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-8">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[0.7rem] tracking-[0.15em] text-muted uppercase">
                      Subtotal
                    </span>
                    <span className="text-white">
                      $
                      {subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[0.7rem] tracking-[0.15em] text-muted uppercase">
                      Envio
                    </span>
                    <span className="text-[0.7rem] tracking-widest text-white uppercase font-medium">
                      Gratis
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 my-6" />

                <div className="flex items-center justify-between mb-8">
                  <span className="text-[0.7rem] tracking-[0.25em] text-muted uppercase">
                    Total
                  </span>
                  <span className="text-2xl md:text-3xl text-white font-light">
                    $
                    {subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-white text-black py-4 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-foreground transition-colors cursor-pointer text-center"
                >
                  Finalizar compra
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-muted" />
                    <span className="text-[0.6rem] tracking-widest text-muted uppercase">
                      Pago seguro y encriptado
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-muted" />
                    <span className="text-[0.6rem] tracking-widest text-muted uppercase">
                      Envio asegurado a todo el pais
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
