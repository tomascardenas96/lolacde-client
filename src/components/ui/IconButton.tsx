import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "ghost" | "outline" | "solid";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon: ReactNode;
  label: string;
}

const variantStyles: Record<Variant, string> = {
  ghost: "bg-transparent text-muted hover:text-white hover:bg-white/5",
  outline:
    "bg-transparent text-white border border-white/15 hover:border-white/40 hover:bg-white/5",
  solid: "bg-surface-3 text-white border border-white/10 hover:bg-surface-4",
};

const sizeStyles: Record<Size, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { variant = "ghost", size = "md", icon, label, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center transition-colors cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
});
