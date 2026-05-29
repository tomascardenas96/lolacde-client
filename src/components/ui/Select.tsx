import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, hint, className, id, children, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[10px] tracking-[0.2em] text-muted uppercase mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          {...props}
          className={cn(
            "block w-full appearance-none bg-transparent border text-sm text-white",
            "px-4 py-3 pr-10 outline-none transition-colors duration-200 cursor-pointer",
            error
              ? "border-danger focus:border-danger"
              : "border-white/15 focus:border-white/40",
            props.disabled && "opacity-40 cursor-not-allowed",
            className,
          )}
        >
          {children}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
          strokeWidth={1.5}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
