import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Product } from "@/features/products/types/state.types";
import { ProductDetail } from "./ProductDetail";

const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3010/api/v1";

// Cacheado por request: generateMetadata y la página comparten una sola llamada.
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  try {
    const res = await fetch(`${apiUrl}/products/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const image =
    product.images?.find((i) => i.isMain)?.url ?? product.images?.[0]?.url;
  const description =
    product.description?.slice(0, 160) ||
    `Descubrí ${product.name} en Lola, centro de estética.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/catalogue/${product.slug}` },
    openGraph: {
      title: `${product.name} | Lola`,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
