"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { StatusBadge } from "@/features/dashboard/components/StatusBadge";
import { useAdminOrdersStore } from "@/features/admin-orders/store/adminOrdersStore";
import { adminOrdersService } from "@/features/admin-orders/services/adminOrdersService";
import {
  STATUS_TRANSITIONS,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminOrdersQuery,
} from "@/features/admin-orders/types/state.types";
import type { Column } from "@/features/dashboard/types/dashboard.types";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const LIMIT = 10;

const tabs: { label: string; value: AdminOrderStatus | "all" }[] = [
  { label: "Todas", value: "all" },
  { label: "Pendientes de entrega", value: "paid" },
  { label: "Entregadas", value: "delivered" },
  { label: "Canceladas", value: "cancelled" },
];

// Estados visibles en la pestaña "Todas": ocultamos las pendientes de pago
// (y las legacy en "shipped"), que no son parte del flujo de entrega.
const ALL_TAB_STATUSES: AdminOrderStatus[] = ["paid", "delivered", "cancelled"];

const columns: Column<AdminOrder>[] = [
  {
    key: "orderNumber",
    label: "Orden",
    render: (item) => (
      <span className="font-medium text-white">{item.orderNumber}</span>
    ),
  },
  {
    key: "customer",
    label: "Cliente",
    render: (item) => (
      <div>
        <div className="text-white/90">
          {item.user.name} {item.user.lastname}
        </div>
        <div className="text-xs text-muted">{item.user.email}</div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (item) => (
      <span className="font-medium">
        ${item.totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Fecha",
    render: (item) =>
      new Date(item.createdAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminOrderStatus | "all">(
    "paid",
  );
  const [offset, setOffset] = useState(0);
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const { orders, total, isLoading, error } = useAdminOrdersStore();

  const loadOrders = useCallback(() => {
    const query: AdminOrdersQuery = { limit: LIMIT, offset };
    if (activeTab === "all") {
      query.statuses = ALL_TAB_STATUSES;
    } else {
      query.status = activeTab;
    }
    adminOrdersService.getOrders(query);
  }, [activeTab, offset]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleTabChange = (value: AdminOrderStatus | "all") => {
    setActiveTab(value);
    setOffset(0);
  };

  const handleMarkDelivered = async (order: AdminOrder) => {
    if (deliveringId) return;
    const ok = window.confirm(
      `¿Marcar la orden ${order.orderNumber} como entregada? Esta acción no se puede deshacer.`,
    );
    if (!ok) return;
    setDeliveringId(order.id);
    try {
      await adminOrdersService.updateStatus(order.id, "delivered");
      // Recargamos el listado para que la orden salga del filtro actual
      // (p. ej. "Pendientes de entrega") y los totales queden correctos.
      loadOrders();
    } catch {
      // El error ya quedó reflejado en el banner (store.setError).
    } finally {
      setDeliveringId(null);
    }
  };

  // Columna de acción: solo se puede entregar desde el listado si el estado
  // actual admite la transición a "delivered" (paid o shipped).
  const actionColumn: Column<AdminOrder> = {
    key: "actions",
    label: "",
    render: (item) =>
      STATUS_TRANSITIONS[item.status].includes("delivered") ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMarkDelivered(item);
          }}
          disabled={deliveringId !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] tracking-[0.1em] uppercase rounded-sm bg-card-light text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {deliveringId === item.id ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Check size={12} />
          )}
          Marcar entregada
        </button>
      ) : null,
  };

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  return (
    <div className="max-w-[1400px]">
      <DashboardHeader title="Órdenes" subtitle="Gestión de órdenes" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 text-xs tracking-[0.1em] uppercase rounded-sm transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? "bg-card-light text-white"
                : "text-muted hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-sm text-danger text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted text-sm">
            No se encontraron órdenes
          </div>
        ) : (
          <DataTable
            columns={[...columns, actionColumn]}
            data={orders}
            keyExtractor={(item) => item.id}
            onRowClick={(item) =>
              router.push(`/dashboard/orders/${item.id}`)
            }
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted">
          <span>
            Mostrando {offset + 1}–{Math.min(offset + LIMIT, total)} de {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
              disabled={offset === 0}
              className="p-1.5 rounded-sm hover:bg-card-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white/80">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setOffset(offset + LIMIT)}
              disabled={offset + LIMIT >= total}
              className="p-1.5 rounded-sm hover:bg-card-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
