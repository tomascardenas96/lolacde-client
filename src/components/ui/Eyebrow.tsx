import { HTMLAttributes } from "react";
import { cn } from "./cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "bare";
  as?: "div" | "p" | "span";
}

export function Eyebrow({
  variant = "default",
  as: Tag = "div",
  className,
  children,
  ...props
}: Props) {
  if (variant === "centered") {
    return (
      <div
        className={cn("flex items-center justify-center gap-3", className)}
        {...props}
      >
        <span className="w-8 h-px bg-accent" />
        <span className="text-[0.625rem] tracking-[0.3em] text-accent font-light uppercase">
          {children}
        </span>
        <span className="w-8 h-px bg-accent" />
      </div>
    );
  }
  return (
    <Tag
      className={cn(
        "text-[0.625rem] tracking-[0.3em] text-accent uppercase font-light",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
