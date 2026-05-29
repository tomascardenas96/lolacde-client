import { HTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

type Variant = "default" | "elevated" | "outline" | "ghost";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  interactive?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-surface-2 border border-white/5",
  elevated: "bg-surface-2 border border-white/10 shadow-md",
  outline: "bg-transparent border border-white/15",
  ghost: "bg-transparent border-0",
};

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { variant = "default", interactive, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        variantStyles[variant],
        interactive &&
          "transition-all duration-300 hover:border-white/20 hover:bg-surface-3 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 pt-6 pb-4 border-b border-white/5", className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-6 pt-4 pb-6 border-t border-white/5 flex items-center justify-end gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-sm uppercase tracking-[0.15em] text-white font-medium",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-muted mt-2 leading-relaxed", className)} {...props} />
  );
}
