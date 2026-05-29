"use client";

import { ReactNode, useState } from "react";
import { cn } from "./cn";

interface Props {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

const sideStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, side = "top", children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap pointer-events-none animate-fade-in",
            "bg-surface-4 border border-white/10 text-white shadow-md",
            "px-3 py-1.5 text-[0.625rem] tracking-[0.15em] uppercase",
            sideStyles[side],
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
