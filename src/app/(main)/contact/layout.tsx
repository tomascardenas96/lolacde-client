import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Reservá tu turno, hacé una consulta o pasá a conocernos. Estamos para vos.",
  openGraph: {
    title: "Contacto | Lola",
    description: "Reservá tu turno o hacé una consulta. Estamos para vos.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
