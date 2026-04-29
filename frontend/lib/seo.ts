import type { Metadata } from "next";

export const siteConfig = {
  name: "QR Cjenik",
  title: "QR Cjenik - Digitalni Meniji za Restorane i Kafiće",
  description:
    "Moderan sistem za digitalne menije. Brže ažuriranje, nema štampanja, interaktivne slike i cijene. Multi-tenant platforma za kafiće i restorane.",
  url: "https://www.digitalcjenik.com",
  ogImage: "https://www.digitalcjenik.com/og-image.png",
  author: "QR Cjenik",
  email: "info@digitalcjenik.com",
  keywords: [
    "digitalni meni",
    "QR kod meni",
    "meni za restoran",
    "meni za kafić",
    "sustav za menije",
    "digitalni cjenik",
    "interaktivni meni",
    "meni aplikacija",
    "QR cjenik",
    "restorani",
    "kafiće",
    "donos hrane",
    "meni softver",
    "upravljanje menijima",
    "elektronski meni",
  ],
  languages: ["hr", "en"] as const,
};

export function generateMetadata(overrides?: Partial<Metadata>): Metadata {
  return {
    title: {
      default: siteConfig.title,
      template: "%s | QR Cjenik",
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    icons: {
      icon: [
        { url: "/logoqr.png", type: "image/png", sizes: "32x32" },
        { url: "/logoqr.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: [{ url: "/logoqr.png" }],
      apple: [{ url: "/logoqr.png", sizes: "180x180", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "hr_HR",
      alternateLocale: ["en_US"],
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.title,
          type: "image/png",
        },
        {
          url: `${siteConfig.url}/og-image-square.png`,
          width: 800,
          height: 800,
          alt: siteConfig.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@digitalcjenik",
      site: "@digitalcjenik",
    },
    alternates: {
      canonical: siteConfig.url,
      languages: {
        "hr-HR": `${siteConfig.url}?lang=hr`,
        "en-US": `${siteConfig.url}?lang=en`,
      },
    },
    formatDetection: {
      email: true,
      telephone: true,
      address: true,
    },
    ...overrides,
  };
}

export function generateJsonLd(
  pageType: "organization" | "website" | "faq" = "organization",
) {
  const baseStructure = {
    "@context": "https://schema.org",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    description: siteConfig.description,
  };

  const schemas: Record<string, unknown> = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      logo: `${siteConfig.url}/logoqr.png`,
      description: siteConfig.description,
      sameAs: [
        "https://www.facebook.com/digitalcjenik",
        "https://www.instagram.com/digitalcjenik",
        "https://twitter.com/digitalcjenik",
        "https://www.linkedin.com/company/digitalcjenik",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+387-xxx-xxx",
        contactType: "Customer Service",
        email: siteConfig.email,
        areaServed: ["BA", "HR", "RS"],
        availableLanguage: ["hr", "en"],
      },
      founder: {
        "@type": "Person",
        name: "Vlado",
      },
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
        },
        query_input: "required name=search_term_string",
      },
      inLanguage: ["hr", "en"],
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Što je QR Cjenik?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "QR Cjenik je moderna platforma za digitalne menije koja omogućava brzo ažuriranje, upravljanje cijenama i interaktivne menije za restorane i kafiće.",
          },
        },
        {
          "@type": "Question",
          name: "Kako mogu početi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Prijavite se na www.digitalcjenik.com, kreirajte svoj račun i počnite sa kreiranjem menija za vaš lokal.",
          },
        },
        {
          "@type": "Question",
          name: "Je li potrebna kreditna kartica?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ne, možete početi sa besplatnom demo verzijom bez unošenja podataka o plaćanju.",
          },
        },
      ],
    },
  };

  return schemas[pageType] || schemas.organization;
}
