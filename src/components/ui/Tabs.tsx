"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { cn } from "./cn";

interface Ctx {
  value: string;
  setValue: (v: string) => void;
}
const TabsCtx = createContext<Ctx | null>(null);
function useTabs() {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs.* must be used inside <Tabs />");
  return ctx;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsCtx.Provider value={{ value: current, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center border-b border-white/10 gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const { value: current, setValue } = useTabs();
  const active = current === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => setValue(value)}
      className={cn(
        "relative py-3 text-[0.7rem] tracking-[0.25em] uppercase cursor-pointer transition-colors",
        active ? "text-white" : "text-muted hover:text-white",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute left-0 right-0 -bottom-px h-px transition-all",
          active ? "bg-accent" : "bg-transparent",
        )}
      />
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const { value: current } = useTabs();
  if (current !== value) return null;
  return (
    <div role="tabpanel" className={cn("pt-6 animate-fade-in", className)}>
      {children}
    </div>
  );
}
