"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useOrdersStore } from "@/features/orders/store/ordersStore";
import { ordersService } from "@/features/orders/services/ordersService";
import { useAuthStore } from "@/features/auth/store/authStore";
import { OrderStatus } from "@/features/orders/types/state.types";
import { ArrowLeft, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

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

// Polling al volver de Mercado Pago: el estado real lo confirma el webhook
// server-to-server, asi que la orden puede seguir "pending" unos segundos.
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_TRIES = 6; // ~12s maximo

type PaymentHint = "success" | "failure" | "pending";

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background pt-28 pb-20">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        </main>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

function OrderDetailContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const paymentHint = searchParams.get("payment") as PaymentHint | null;

  const order = useOrdersStore((s) => s.selectedOrder);
  const isLoading = useOrdersStore((s) => s.isLoading);
  const error = useOrdersStore((s) => s.error);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [isConfirming, setIsConfirming] = useState(
    paymentHint !== null && paymentHint !== "failure",
  );
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carga inicial (con spinner global).
  useEffect(() => {
    if (isAuthenticated && orderId) {
      ordersService.getOrder(orderId);
    }
  }, [isAuthenticated, orderId]);

  // Polling de confirmacion al volver de Mercado Pago.
  useEffect(() => {
    if (!isAuthenticated || !orderId) return;
    // Solo confirmamos si venimos del retorno de MP (hay query param)
    // y el hint no es failure (el fallo es definitivo del lado del provider).
    // En esos casos isConfirming ya arranca en false, no hace falta tocarlo.
    if (paymentHint === null || paymentHint === "failure") {
      return;
    }

    let tries = 0;
    let active = true;

    const poll = async () => {
      try {
        const o = await ordersService.refreshOrder(orderId);
        tries += 1;
        // Seguir consultando mientras siga pending y no se agoten los intentos.
        if (active && o.status === "pending" && tries < POLL_MAX_TRIES) {
          pollTimer.current = setTimeout(poll, POLL_INTERVAL_MS);
        } else if (active) {
          setIsConfirming(false);
        }
      } catch {
        // No interrumpimos el flujo por un fallo puntual de red.
        if (active) setIsConfirming(false);
      }
    };

    poll();

    return () => {
      active = false;
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
  }, [isAuthenticated, orderId, paymentHint]);

  // Re-iniciar el pago de una orden pendiente (vuelve a abrir Mercado Pago).
  const handlePay = async () => {
    if (!order) return;
    setIsPaying(true);
    setPayError(null);
    try {
      const payment = await ordersService.pay(order.id, {
        provider: "mercadopago",
      });
      if (payment.redirectUrl) {
        window.location.href = payment.redirectUrl;
        return;
      }
      setPayError("El proveedor no devolvio una URL de pago");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error al iniciar el pago";
      setPayError(msg);
    } finally {
      setIsPaying(false);
    }
  };

  const total =
    order?.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) ?? 0;

  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      {/* Header */}
      <section className="px-6 md:px-20 lg:px-32 mb-12">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-[0.65rem] tracking-[0.15em] uppercase mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Mis pedidos
        </Link>
        <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl text-white mb-3">
          DETALLE DEL <br /> PEDIDO
        </h1>
      </section>

      <section className="px-6 md:px-20 lg:px-32">
        {/* Banner de confirmacion de pago al volver de Mercado Pago */}
        {paymentHint !== null && order && (
          <PaymentBanner
            status={order.status}
            hint={paymentHint}
            confirming={isConfirming}
          />
        )}

        {isLoading && !order ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm tracking-[0.1em] uppercase">
              {error}
            </p>
          </div>
        ) : !order ? (
          <div className="text-center py-20">
            <p className="text-muted text-sm tracking-[0.1em] uppercase">
              Orden no encontrada
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Order Items */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-8">
                <span
                  className={`text-[0.65rem] tracking-[0.15em] uppercase font-medium border px-4 py-1.5 ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
                <span className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {order.items.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <div className="border-t border-white/10" />}
                  <div className="py-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold tracking-[0.1em] text-white uppercase">
                        {item.variant.sku}
                      </h3>
                      <p className="text-xs tracking-[0.1em] text-muted uppercase mt-1">
                        {Object.values(item.variant.attributes).join(" / ")}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {item.quantity} x $
                        {item.unitPrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <p className="text-base text-white font-light">
                      $
                      {(item.unitPrice * item.quantity).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 },
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10" />
            </div>

            {/* Order Info Sidebar */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Total */}
              <div className="bg-card p-8">
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                  Total
                </h2>
                <span className="text-2xl md:text-3xl text-white font-light">
                  $
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Shipping Info */}
              <div className="bg-card p-8">
                <h2 className="text-[0.7rem] tracking-[0.25em] text-white uppercase font-semibold mb-6">
                  Envio
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-white">{order.receiverName}</p>
                  <p className="text-xs text-muted">{order.phone}</p>
                  {order.shippingAddress && (
                    <>
                      <p className="text-xs text-muted mt-3">
                        {order.shippingAddress.street}
                      </p>
                      <p className="text-xs text-muted">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                    </>
                  )}
                  {order.additionalInfo && (
                    <p className="text-xs text-muted/70 mt-2 italic">
                      {order.additionalInfo}
                    </p>
                  )}
                </div>
              </div>

              {/* Pago para ordenes pendientes: re-inicia Mercado Pago */}
              {order.status === "pending" && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying}
                    className="flex w-full items-center justify-center gap-2 bg-white text-black py-4 text-[0.65rem] tracking-[0.2em] uppercase font-semibold hover:bg-foreground transition-colors text-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirigiendo...
                      </>
                    ) : (
                      "Pagar ahora"
                    )}
                  </button>
                  {payError && (
                    <p className="text-red-400 text-xs tracking-widest">
                      {payError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function PaymentBanner({
  status,
  hint,
  confirming,
}: {
  status: OrderStatus;
  hint: PaymentHint;
  confirming: boolean;
}) {
  // El estado de la orden (confirmado por webhook) manda sobre el hint de UX.
  if (status === "paid") {
    return (
      <Banner
        icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
        className="border-green-400/30 bg-green-400/5"
        title="Pago confirmado"
        text="Tu pago fue aprobado. Estamos preparando tu pedido."
      />
    );
  }

  if (status === "cancelled") {
    return (
      <Banner
        icon={<XCircle className="w-5 h-5 text-red-400" />}
        className="border-red-400/30 bg-red-400/5"
        title="Pago no completado"
        text="El pago fue rechazado o cancelado. Puedes intentar nuevamente."
      />
    );
  }

  // Orden todavia pending: distinguimos si seguimos confirmando o si el
  // provider ya nos aviso de un fallo.
  if (hint === "failure") {
    return (
      <Banner
        icon={<XCircle className="w-5 h-5 text-red-400" />}
        className="border-red-400/30 bg-red-400/5"
        title="Pago no completado"
        text="No pudimos procesar el pago. Puedes intentar nuevamente."
      />
    );
  }

  return (
    <Banner
      icon={
        confirming ? (
          <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
        ) : (
          <Clock className="w-5 h-5 text-yellow-400" />
        )
      }
      className="border-yellow-400/30 bg-yellow-400/5"
      title="Confirmando tu pago"
      text="Estamos esperando la confirmacion del pago. Esto puede tardar unos segundos."
    />
  );
}

function Banner({
  icon,
  className,
  title,
  text,
}: {
  icon: React.ReactNode;
  className: string;
  title: string;
  text: string;
}) {
  return (
    <div className={`mb-10 flex items-start gap-4 border p-5 ${className}`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-white font-semibold">
          {title}
        </p>
        <p className="text-xs text-muted mt-1">{text}</p>
      </div>
    </div>
  );
}
