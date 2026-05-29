"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "./cn";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdrop?: boolean;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        className={cn(
          "relative w-full bg-surface-2 border border-white/10 shadow-xl animate-scale-in",
          sizeStyles[size],
        )}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center text-muted hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
        {(eyebrow || title) && (
          <div className="px-7 pt-7 pb-5 border-b border-white/5">
            {eyebrow && (
              <p className="text-[0.625rem] tracking-[0.3em] text-accent uppercase mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="text-xl md:text-2xl text-white heading-display">
                {title}
              </h3>
            )}
          </div>
        )}
        <div className="px-7 py-6">{children}</div>
        {footer && (
          <div className="px-7 pt-4 pb-7 border-t border-white/5 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
