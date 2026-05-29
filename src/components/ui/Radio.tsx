import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./cn";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, Props>(function Radio(
  { label, description, className, id, ...props },
  ref,
) {
  const inputId = id ?? `${props.name}-${props.value}`;
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
          type="radio"
          {...props}
          className="peer absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <span
          className={cn(
            "w-4 h-4 rounded-full border border-white/30 bg-transparent transition-all",
            "peer-checked:border-accent",
            "peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2",
            "group-hover:border-white/60",
          )}
        />
        <span className="absolute w-2 h-2 rounded-full bg-accent scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
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
