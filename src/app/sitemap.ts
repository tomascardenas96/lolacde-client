import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3010/api/v1";

interface SitemapProduct {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/catalogue`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${apiUrl}/products?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const products: SitemapProduct[] = data?.products ?? [];
      productRoutes = products
        .filter((p) => p.slug)
        .map((p) => ({
          url: `${siteUrl}/catalogue/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
    }
  } catch {
    // Si la API no está disponible, el sitemap igual devuelve las rutas estáticas.
  }

  return [...staticRoutes, ...productRoutes];
}
