import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Conocé los tratamientos y servicios de estética de Lola, pensados para tu bienestar y cuidado personal.",
  openGraph: {
    title: "Servicios | Lola",
    description:
      "Tratamientos y servicios de estética pensados para tu bienestar y cuidado personal.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
