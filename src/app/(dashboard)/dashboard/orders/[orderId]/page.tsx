"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { StatusBadge } from "@/features/dashboard/components/StatusBadge";
import { useAdminOrdersStore } from "@/features/admin-orders/store/adminOrdersStore";
import { adminOrdersService } from "@/features/admin-orders/services/adminOrdersService";
import {
  STATUS_TRANSITIONS,
  type AdminOrderStatus,
} from "@/features/admin-orders/types/state.types";

const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  pending: "pendiente",
  paid: "pagada",
  shipped: "enviada",
  delivered: "entregada",
  cancelled: "cancelada",
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { selectedOrder: order, isLoading, isUpdating, error } =
    useAdminOrdersStore();
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) adminOrdersService.getOrder(orderId);
    return () => useAdminOrdersStore.getState().setSelectedOrder(null);
  }, [orderId]);

  const handleStatusChange = async (newStatus: AdminOrderStatus) => {
    if (!order) return;
    setStatusError(null);
    try {
      await adminOrdersService.updateStatus(order.id, newStatus);
    } catch {
      setStatusError("No se pudo actualizar el estado");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-[1400px]">
        <button
          onClick={() => router.push("/dashboard/orders")}
          className="flex items-center gap-2 text-muted hover:text-white text-xs tracking-[0.15em] uppercase transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Volver a órdenes
        </button>
        <div className="text-center py-20 text-muted text-sm">
          {error || "Orden no encontrada"}
        </div>
      </div>
    );
  }

  const availableTransitions = STATUS_TRANSITIONS[order.status];

  return (
    <div className="max-w-[1400px]">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/orders")}
        className="flex items-center gap-2 text-muted hover:text-white text-xs tracking-[0.15em] uppercase transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Volver a órdenes
      </button>

      {/* Header */}
      <DashboardHeader
        title={order.orderNumber}
        subtitle={`Realizada el ${new Date(order.createdAt).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}`}
        actions={<StatusBadge status={order.status} />}
      />

      {/* Status update + error */}
      {statusError && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-sm text-danger text-sm">
          {statusError}
        </div>
      )}

      {/* Top row: Customer + Shipping + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Customer */}
        <div className="bg-card rounded-sm p-5">
          <h3 className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-4">
            Cliente
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-white">
              {order.user.name} {order.user.lastname}
            </p>
            <p className="text-xs text-muted">{order.user.email}</p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-card rounded-sm p-5">
          <h3 className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-4">
            Dirección de envío
          </h3>
          <div className="space-y-1 text-sm">
            <p className="text-white">{order.shippingAddress.receiverName}</p>
            <p className="text-white/70">{order.shippingAddress.street}</p>
            <p className="text-white/70">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-white/70">{order.shippingAddress.country}</p>
            <p className="text-xs text-muted mt-2">
              {order.shippingAddress.phone}
            </p>
            {order.shippingAddress.additionalInfo && (
              <p className="text-xs text-muted italic">
                {order.shippingAddress.additionalInfo}
              </p>
            )}
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-card rounded-sm p-5">
          <h3 className="text-[0.6rem] tracking-[0.2em] text-muted uppercase mb-4">
            Actualizar estado
          </h3>
          {availableTransitions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`px-4 py-2 text-xs tracking-[0.1em] uppercase rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    status === "cancelled"
                      ? "border border-danger/30 text-danger hover:bg-danger/10"
                      : "bg-card-light text-white hover:bg-white/10"
                  }`}
                >
                  {isUpdating ? "..." : `Marcar como ${STATUS_LABELS[status]}`}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted italic">
              Es un estado final — no hay más transiciones disponibles.
            </p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-sm mb-6">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-[0.6rem] tracking-[0.2em] text-muted uppercase">
            Artículos ({order.items.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                  SKU
                </th>
                <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                  Variante
                </th>
                <th className="text-right text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                  Precio
                </th>
                <th className="text-right text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                  Cant.
                </th>
                <th className="text-right text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5"
                >
                  <td className="py-3 px-5 text-sm text-white/80 font-mono text-xs">
                    {item.variant.sku}
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(item.variant.attributes).map(
                        ([key, val]) => (
                          <span
                            key={key}
                            className="inline-block px-2 py-0.5 bg-card-light rounded-sm text-[0.65rem] tracking-[0.05em] text-white/70 uppercase"
                          >
                            {key}: {val}
                          </span>
                        ),
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-sm text-white/80 text-right">
                    $
                    {item.priceAtPurchase.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-5 text-sm text-white/80 text-right">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-5 text-sm text-white font-medium text-right">
                    $
                    {(item.priceAtPurchase * item.quantity).toLocaleString(
                      "es-AR",
                      { minimumFractionDigits: 2 },
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Totals */}
        <div className="px-5 py-4 border-t border-white/5 flex justify-end">
          <div className="space-y-1 text-right">
            {order.discountAmount > 0 && (
              <div className="flex items-center gap-6">
                <span className="text-xs text-muted uppercase tracking-[0.1em]">
                  Descuento
                </span>
                <span className="text-sm text-success">
                  -$
                  {order.discountAmount.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted uppercase tracking-[0.1em]">
                Total
              </span>
              <span className="text-lg text-white font-medium">
                $
                {order.totalAmount.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments */}
      {order.payments && order.payments.length > 0 && (
        <div className="bg-card rounded-sm">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-[0.6rem] tracking-[0.2em] text-muted uppercase">
              Historial de pagos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                    Método
                  </th>
                  <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                    Estado
                  </th>
                  <th className="text-right text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                    Monto
                  </th>
                  <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                    ID de transacción
                  </th>
                  <th className="text-left text-[0.6rem] tracking-[0.2em] text-muted uppercase py-3 px-5 font-medium">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-white/5"
                  >
                    <td className="py-3 px-5 text-sm text-white/80 capitalize">
                      {payment.method}
                    </td>
                    <td className="py-3 px-5">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="py-3 px-5 text-sm text-white/80 text-right">
                      $
                      {payment.amount.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-5 text-xs text-muted font-mono">
                      {payment.transactionId}
                    </td>
                    <td className="py-3 px-5 text-sm text-white/70">
                      {new Date(payment.createdAt).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
