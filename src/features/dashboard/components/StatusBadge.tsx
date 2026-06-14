type StatusType =
  | "active"
  | "inactive"
  | "draft"
  | "archived"
  | "pending"
  | "processing"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed"
  | "failed"
  | "refunded";

const statusLabels: Record<StatusType, string> = {
  active: "Activo",
  inactive: "Inactivo",
  draft: "Borrador",
  archived: "Archivado",
  pending: "Pendiente",
  processing: "Procesando",
  paid: "Pagada",
  shipped: "Enviada",
  delivered: "Entregada",
  cancelled: "Cancelada",
  completed: "Completada",
  failed: "Fallida",
  refunded: "Reembolsada",
};

const statusStyles: Record<StatusType, string> = {
  active: "bg-success/15 text-success",
  inactive: "bg-muted/15 text-muted",
  draft: "bg-warning/15 text-warning",
  archived: "bg-muted/15 text-muted",
  pending: "bg-warning/15 text-warning",
  processing: "bg-accent/15 text-accent",
  paid: "bg-success/15 text-success",
  shipped: "bg-blue-500/15 text-blue-400",
  delivered: "bg-emerald-800/30 text-emerald-400",
  cancelled: "bg-danger/15 text-danger",
  completed: "bg-success/15 text-success",
  failed: "bg-danger/15 text-danger",
  refunded: "bg-muted/15 text-muted",
};

export const StatusBadge = ({ status }: { status: StatusType }) => {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[0.65rem] tracking-[0.1em] uppercase rounded-sm ${
        statusStyles[status] || "bg-muted/15 text-muted"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
};
