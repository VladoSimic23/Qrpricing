import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

type Tenant = {
  slug: { current: string };
  _updatedAt: string;
};

export default async function menuSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.digitalcjenik.com";
  const languages = ["hr", "en"];

  try {
    // Fetch svi aktivni tenants
    const tenants = await client.fetch<Tenant[]>(
      `*[_type == "tenant" && isActive != false]{
        slug,
        _updatedAt
      } | order(_updatedAt desc)`,
      {},
      { cache: "no-cache" },
    );

    // Generiši sitemap entries za sve tenatne sa oba jezika
    const menuRoutes = tenants.flatMap((tenant) =>
      languages.map((lang) => ({
        url: `${baseUrl}/menu/${tenant.slug.current}?lang=${lang}`,
        lastModified: new Date(tenant._updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );

    return menuRoutes;
  } catch (error) {
    console.error("Error generating menu sitemap:", error);
    return [];
  }
}
