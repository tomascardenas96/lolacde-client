import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "./cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, trailing, leading, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor={inputId}
            className="text-[10px] tracking-[0.2em] text-muted uppercase"
          >
            {label}
          </label>
        </div>
      )}
      <div className="relative flex items-center">
        {leading && (
          <span className="absolute left-4 text-muted pointer-events-none">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          {...props}
          className={cn(
            "block w-full bg-transparent border text-sm text-white",
            "placeholder:text-white/20 outline-none transition-colors duration-200",
            "py-3",
            leading ? "pl-11" : "pl-4",
            trailing ? "pr-11" : "pr-4",
            error
              ? "border-danger focus:border-danger"
              : "border-white/15 focus:border-white/40",
            props.disabled && "opacity-40 cursor-not-allowed",
            className,
          )}
        />
        {trailing && (
          <span className="absolute right-4 text-muted">{trailing}</span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
