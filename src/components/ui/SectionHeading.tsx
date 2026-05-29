import { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Eyebrow } from "./Eyebrow";

interface Props extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <Eyebrow variant={align === "center" ? "centered" : "default"}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className="heading-display text-3xl md:text-5xl lg:text-6xl text-white text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm md:text-base text-muted leading-relaxed max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
