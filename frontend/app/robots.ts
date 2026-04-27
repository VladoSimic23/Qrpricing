import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/menu/"],
        disallow: ["/dashboard", "/studio", "/api/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/menu/", "/sign-in", "/sign-up"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/menu/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: "https://www.digitalcjenik.com/sitemap.xml",
  };
}
