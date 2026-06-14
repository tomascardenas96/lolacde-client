"use client";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { CreateProductForm } from "@/features/products/components/CreateProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-[1400px]">
      <DashboardHeader
        title="Nuevo producto"
        subtitle="Inventario · Crear"
      />
      <CreateProductForm />
    </div>
  );
}
