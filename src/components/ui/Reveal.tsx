"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms applied to the reveal transition. */
  delay?: number;
  /** Fraction of the element visible before it reveals (0–1). */
  threshold?: number;
}

/**
 * Reveals its children with a fade + rise the first time it scrolls into view.
 * The visual state lives in globals.css ([data-reveal] / [data-shown]); this
 * only toggles the flag. Renders a plain <div>, so it can replace an existing
 * block-level wrapper without changing layout (just move the className over).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  threshold = 0.15,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
