import { HTMLAttributes } from "react";
import { cn } from "./cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "subtle" | "default" | "accent" | "gradient";
  label?: string;
}

const variantStyles = {
  subtle: "bg-white/5",
  default: "bg-white/10",
  accent: "bg-accent/40",
  gradient:
    "bg-gradient-to-r from-transparent via-accent/40 to-transparent",
};

export function Divider({
  orientation = "horizontal",
  variant = "default",
  label,
  className,
  ...props
}: Props) {
  if (label) {
    return (
      <div
        className={cn("flex items-center gap-4 w-full", className)}
        {...props}
      >
        <div className={cn("flex-1 h-px", variantStyles[variant])} />
        <span className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">
          {label}
        </span>
        <div className={cn("flex-1 h-px", variantStyles[variant])} />
      </div>
    );
  }
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal" ? "w-full h-px" : "h-full w-px",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
