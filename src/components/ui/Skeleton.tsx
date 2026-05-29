import { HTMLAttributes } from "react";
import { cn } from "./cn";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "text" | "circle";
}

export function Skeleton({ variant = "rect", className, ...props }: Props) {
  return (
    <div
      className={cn(
        "skeleton",
        variant === "text" && "h-3",
        variant === "circle" && "rounded-full aspect-square",
        className,
      )}
      {...props}
    />
  );
}
