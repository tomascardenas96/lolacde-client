"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useOrdersStore } from "@/features/orders/store/ordersStore";
import { ordersService } from "@/features/orders/services/ordersService";
import { useAuthStore } from "@/features/auth/store/authStore";
import { OrderStatus } from "@/features/orders/types/state.types";
import { Loader2, Package } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-400 border-yellow-400/30",
  paid: "text-green-400 border-green-400/30",
  shipped: "text-blue-400 border-blue-400/30",
  delivered: "text-white border-white/30",
  cancelled: "text-red-400 border-red-400/30",
};

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const isLoading = useOrdersStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      ordersService.getOrders();
    }
  }, [isAuthenticated]);

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          MIS <br /> PEDIDOS
        </h1>
      </section>

      <section className="px-6 md:px-20 lg:px-32">
        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Inicia sesion para ver tus pedidos
            </p>
            <Link
              href="/login"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Iniciar sesion
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 text-muted mx-auto mb-4" />
            <p className="text-muted text-sm tracking-[0.1em] uppercase mb-6">
              Aun no tienes pedidos
            </p>
            <Link
              href="/catalogue"
              className="inline-block border border-white/20 px-10 py-4 text-[0.65rem] tracking-[0.2em] text-white uppercase hover:bg-white hover:text-black transition-all"
            >
              Explorar catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, i) => sum + Number(i.priceAtPurchase) * i.quantity,
                0,
              );
              const itemCount = order.items.reduce(
                (sum, i) => sum + i.quantity,
                0,
              );

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block border border-white/10 p-6 hover:border-white/25 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`text-[0.6rem] tracking-[0.15em] uppercase font-medium border px-3 py-1 ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                        <span className="text-[0.6rem] tracking-[0.1em] text-muted">
                          {new Date(order.createdAt).toLocaleDateString(
                            "es-AR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted tracking-[0.05em]">
                        {itemCount} {itemCount === 1 ? "producto" : "productos"}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-lg text-white font-light">
                        $
                        {total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-[0.65rem] tracking-[0.15em] text-muted group-hover:text-white transition-colors uppercase">
                        Ver detalle
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
