import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Descubrí nuestra línea de productos de belleza y cuidado personal, seleccionados para ofrecer la máxima calidad y resultados excepcionales.",
  openGraph: {
    title: "Catálogo de productos | Lola",
    description:
      "Línea de productos de belleza y cuidado personal seleccionados para complementar tu rutina.",
  },
};

export default function CatalogueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
