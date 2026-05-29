"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { EditProductForm } from "@/features/products/components/EditProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="max-w-[1400px]">
      <Link
        href="/dashboard/inventory"
        className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.2em] text-muted hover:text-white uppercase transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Inventory
      </Link>
      <DashboardHeader title="Edit Product" subtitle="Inventory · Update" />
      <EditProductForm productId={id} />
    </div>
  );
}
