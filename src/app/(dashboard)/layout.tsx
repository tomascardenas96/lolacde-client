"use client";

import { AdminGuard } from "@/features/dashboard/components/AdminGuard";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <ToastProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
        </div>
      </ToastProvider>
    </AdminGuard>
  );
}
