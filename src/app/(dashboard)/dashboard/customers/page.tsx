"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DataTable } from "@/features/dashboard/components/DataTable";
import { StatusBadge } from "@/features/dashboard/components/StatusBadge";
import { customersService } from "@/features/dashboard/services/customersService";
import { useCustomersStore } from "@/features/dashboard/store/customersStore";
import type {
  Customer,
  Column,
} from "@/features/dashboard/types/dashboard.types";

const PAGE_SIZE = 20;

const columns: Column<Customer>[] = [
  {
    key: "name",
    label: "Cliente",
    render: (item) => (
      <div>
        <span className="font-medium">{item.name}</span>
        <p className="text-xs text-muted mt-0.5">{item.email}</p>
      </div>
    ),
  },
  { key: "totalOrders", label: "Órdenes" },
  {
    key: "totalSpent",
    label: "Total gastado",
    render: (item) => `$${item.totalSpent.toLocaleString("es-AR")}`,
  },
  {
    key: "joinedAt",
    label: "Alta",
    render: (item) =>
      new Date(item.joinedAt).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    key: "status",
    label: "Estado",
    render: (item) => <StatusBadge status={item.status} />,
  },
];

export default function CustomersPage() {
  const customers = useCustomersStore((s) => s.customers);
  const total = useCustomersStore((s) => s.total);
  const isLoading = useCustomersStore((s) => s.isLoading);
  const [page, setPage] = useState(1);

  // Consume /user (paginado) en lugar de derivar de cientos de órdenes.
  useEffect(() => {
    customersService.getCustomers({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  return (
    <div className="max-w-[1400px]">
      <DashboardHeader title="Clientes" subtitle="Gestión de clientes" />

      <div className="bg-card rounded-sm">
        {isLoading && customers.length === 0 ? (
          <p className="text-xs text-muted tracking-[0.1em] uppercase py-16 text-center">
            Cargando clientes...
          </p>
        ) : customers.length === 0 ? (
          <p className="text-xs text-muted tracking-[0.1em] uppercase py-16 text-center">
            No hay clientes registrados todavía
          </p>
        ) : (
          <DataTable
            columns={columns}
            data={customers}
            keyExtractor={(item) => item.id}
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-[0.65rem] tracking-[0.15em] uppercase border border-white/10 text-muted hover:border-white/30 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-xs text-muted tabular-nums px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-[0.65rem] tracking-[0.15em] uppercase border border-white/10 text-muted hover:border-white/30 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
