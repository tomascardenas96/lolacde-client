"use client";

import { useEffect, useState } from "react";

type CategoryNavProps = {
  categories: { id: string; eyebrow: string }[];
};

export function CategoryNav({ categories }: CategoryNavProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-140px 0px -55% 0px", threshold: 0 },
    );

    categories.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const handleClick = (id: string) => {
    setActive(id);
  };

  return (
    <nav className="sticky top-[95px] z-30 bg-background/95 backdrop-blur-sm border-y border-white/5">
      <div className="px-6 md:px-16 py-5 overflow-x-auto">
        <ul className="flex items-center gap-8 md:gap-12 justify-start md:justify-center min-w-max">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={`#${cat.id}`}
                onClick={() => handleClick(cat.id)}
                className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                  active === cat.id
                    ? "text-accent"
                    : "text-muted hover:text-accent"
                }`}
              >
                {cat.eyebrow}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
