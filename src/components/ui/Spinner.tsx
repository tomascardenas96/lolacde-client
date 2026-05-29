import { cn } from "./cn";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeStyles = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-2",
};

export function Spinner({ size = "md", className, label }: Props) {
  return (
    <span
      role="status"
      aria-label={label ?? "Cargando"}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "border-accent border-t-transparent rounded-full animate-spin",
          sizeStyles[size],
        )}
      />
      {label && (
        <span className="text-[0.625rem] tracking-[0.3em] text-muted uppercase">
          {label}
        </span>
      )}
    </span>
  );
}
