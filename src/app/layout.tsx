import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

// Display serif — high-contrast, editorial. Reserved for headings via .heading-display
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lola — Centro de Estética",
    template: "%s | Lola",
  },
  description:
    "Lola, centro de estética. Descubrí nuestra línea de productos de belleza y cuidado personal, seleccionados para complementar tu rutina.",
  keywords: [
    "estética",
    "belleza",
    "cuidado personal",
    "cosmética",
    "productos de belleza",
  ],
  applicationName: "Lola",
  authors: [{ name: "Lola" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Lola — Centro de Estética",
    title: "Lola — Centro de Estética",
    description:
      "Línea de productos de belleza y cuidado personal seleccionados para complementar tu rutina.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Lola — Centro de Estética",
    description:
      "Línea de productos de belleza y cuidado personal seleccionados para complementar tu rutina.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} ${fraunces.variable} ${manrope.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
