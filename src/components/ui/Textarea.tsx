import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, hint, className, id, ...props },
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
      <textarea
        ref={ref}
        id={inputId}
        {...props}
        className={cn(
          "block w-full px-4 py-3 bg-transparent border text-sm text-white",
          "placeholder:text-white/20 outline-none transition-colors duration-200",
          "resize-none min-h-[120px]",
          error
            ? "border-danger focus:border-danger"
            : "border-white/15 focus:border-white/40",
          props.disabled && "opacity-40 cursor-not-allowed",
          className,
        )}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
