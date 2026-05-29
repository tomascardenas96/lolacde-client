import { HTMLAttributes } from "react";
import { cn } from "./cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface Props extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: Size;
  status?: "online" | "offline" | "busy" | "away";
}

const sizeStyles: Record<Size, string> = {
  xs: "w-6 h-6 text-[0.5rem]",
  sm: "w-8 h-8 text-[0.625rem]",
  md: "w-10 h-10 text-xs",
  lg: "w-14 h-14 text-sm",
  xl: "w-20 h-20 text-base",
};

const statusColors = {
  online: "bg-success",
  offline: "bg-muted",
  busy: "bg-danger",
  away: "bg-warning",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  status,
  className,
  ...props
}: Props) {
  const initials = (fallback ?? alt ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden",
        "bg-surface-3 border border-white/10 text-white uppercase tracking-widest font-medium",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt ?? ""} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-background",
            statusColors[status],
          )}
        />
      )}
    </div>
  );
}
