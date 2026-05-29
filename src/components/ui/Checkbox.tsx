import { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "./cn";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { label, description, className, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group inline-flex items-start gap-3 cursor-pointer select-none",
        props.disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      <span className="relative flex items-center justify-center mt-0.5">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          {...props}
          className="peer absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <span
          className={cn(
            "w-4 h-4 border border-white/30 bg-transparent transition-all",
            "peer-checked:bg-accent peer-checked:border-accent",
            "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2",
            "group-hover:border-white/60",
          )}
        />
        <Check
          className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          strokeWidth={3}
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
