import { HTMLAttributes, ReactNode } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "./cn";

type Variant = "info" | "success" | "warning" | "danger";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, { bg: string; border: string; text: string; Icon: typeof Info }> = {
  info: {
    bg: "bg-info/5",
    border: "border-info/30",
    text: "text-info",
    Icon: Info,
  },
  success: {
    bg: "bg-success/5",
    border: "border-success/30",
    text: "text-success",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "bg-warning/5",
    border: "border-warning/30",
    text: "text-warning",
    Icon: AlertTriangle,
  },
  danger: {
    bg: "bg-danger/5",
    border: "border-danger/30",
    text: "text-danger",
    Icon: XCircle,
  },
};

export function Alert({
  variant = "info",
  title,
  icon,
  className,
  children,
  ...props
}: Props) {
  const { bg, border, text, Icon } = variantStyles[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 px-4 py-3 border",
        bg,
        border,
        className,
      )}
      {...props}
    >
      <span className={cn("mt-0.5 shrink-0", text)}>
        {icon ?? <Icon className="w-4 h-4" strokeWidth={1.5} />}
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn("text-xs tracking-[0.15em] uppercase font-medium", text)}>
            {title}
          </p>
        )}
        <div className={cn("text-sm text-white/80 leading-relaxed", title && "mt-1")}>
          {children}
        </div>
      </div>
    </div>
  );
}
