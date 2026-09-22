import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/menu/", "/sign-in", "/sign-up"],
      disallow: ["/dashboard", "/studio", "/api/", "/admin/"],
    },
    sitemap: "https://www.digitalcjenik.com/sitemap.xml",
  };
}
