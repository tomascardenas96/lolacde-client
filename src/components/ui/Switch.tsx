import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, Props>(function Switch(
  { label, description, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group inline-flex items-center gap-3 cursor-pointer select-none",
        props.disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      <span className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          {...props}
          className="peer sr-only"
        />
        <span
          className={cn(
            "w-9 h-5 bg-surface-3 border border-white/15 rounded-full transition-colors",
            "peer-checked:bg-accent peer-checked:border-accent",
            "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2",
          )}
        />
        <span
          className={cn(
            "absolute left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
            "peer-checked:translate-x-4 peer-checked:bg-black",
          )}
        />
      </span>
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-sm text-white leading-tight">{label}</span>
          )}
          {description && (
            <span className="text-xs text-muted mt-0.5">{description}</span>
          )}
        </span>
      )}
    </label>
  );
});
