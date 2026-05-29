import { HTMLAttributes } from "react";
import { cn } from "./cn";

type Variant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";
type Size = "sm" | "md";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
  dot?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-surface-3 text-white border border-white/10",
  accent: "bg-accent/10 text-accent border border-accent/30",
  success: "bg-success/10 text-success border border-success/30",
  warning: "bg-warning/10 text-warning border border-warning/30",
  danger: "bg-danger/10 text-danger border border-danger/30",
  info: "bg-info/10 text-info border border-info/30",
  outline: "bg-transparent text-muted border border-white/15",
};

const dotColors: Record<Variant, string> = {
  default: "bg-white",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  outline: "bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[0.55rem] tracking-[0.2em]",
  md: "px-3 py-1 text-[0.625rem] tracking-[0.25em]",
};

export function Badge({
  variant = "default",
  size = "md",
  dot,
  className,
  children,
  ...props
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 uppercase font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  );
}
