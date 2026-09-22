import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.digitalcjenik.com";
  const languages = ["hr", "en"];

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sign-in`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Dodaj sve jezičke varijante za glavne stranice
  const multiLanguageRoutes = staticRoutes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${route.url}${route.url === baseUrl ? "" : ""}?lang=${lang}`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );

  try {
    const tenants = await client.fetch<
      { slug: { current: string }; _updatedAt: string }[]
    >(
      `*[_type == "tenant" && isActive != false && defined(slug.current)]{slug, _updatedAt}`,
      {},
      { cache: "no-store" },
    );

    const menuRoutes = tenants.flatMap((tenant) =>
      languages.map((lang) => ({
        url: `${baseUrl}/menu/${tenant.slug.current}?lang=${lang}`,
        lastModified: new Date(tenant._updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );

    return [...multiLanguageRoutes, ...menuRoutes];
  } catch {
    return multiLanguageRoutes;
  }
}
