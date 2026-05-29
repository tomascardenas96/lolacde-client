import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "link";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-black border border-accent hover:bg-transparent hover:text-accent",
  secondary:
    "bg-surface-3 text-white border border-white/10 hover:bg-surface-4 hover:border-white/20",
  outline:
    "bg-transparent text-white border border-white/30 hover:border-white hover:bg-white hover:text-black",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-white hover:bg-white/5",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger hover:text-white",
  link:
    "bg-transparent text-accent border-0 px-0 py-0 hover:text-accent-300 underline-offset-4 hover:underline",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[0.625rem] tracking-[0.2em]",
  md: "px-7 py-3.5 text-[0.7rem] tracking-[0.2em]",
  lg: "px-9 py-5 text-xs tracking-[0.25em]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    loading,
    leading,
    trailing,
    fullWidth,
    className,
    disabled,
    children,
    ...props
  },
  ref,
) {
  const isLink = variant === "link";
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 uppercase font-medium",
        "transition-all duration-300 ease-out",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        !disabled && !loading && "cursor-pointer",
        !isLink && sizeStyles[size],
        variantStyles[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leading
      )}
      {children}
      {!loading && trailing}
    </button>
  );
});
