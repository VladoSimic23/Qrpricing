import type { Metadata } from "next";

export const siteConfig = {
  name: "QR Cjenik",
  title: "QR Cjenik - Digitalni Meniji za Restorane i Kafiće",
  description:
    "Moderan sistem za digitalne menije. Brže ažuriranje, nema štampanja, interaktivne slike i cijene. Multi-tenant platforma za kafiće i restorane.",
  url: "https://www.digitalcjenik.com",
  ogImage: "https://www.digitalcjenik.com/og-image.png",
  author: "QR Cjenik",
  email: "vladimir.simic@digitalcjenik.com",
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
    "dostava hrane",
    "meni softver",
    "upravljanje menijima",
    "elektronski meni",
  ],
  languages: ["hr", "en"] as const,
};

export const faqItems = [
  {
    question: "Što je QR Cjenik ili digitalni meni?",
    answer:
      "QR Cjenik je platforma za digitalne menije za restorane, kafiće i druge ugostiteljske objekte. Gost skenira QR kod i odmah otvara aktualnu ponudu na svom mobitelu.",
  },
  {
    question: "Kako mogu promijeniti cijene i ponudu?",
    answer:
      "Cijene, artikle, kategorije i dnevnu ponudu uređujete iz dashboarda. Promjene se objavljuju na javnom meniju bez ponovnog tiskanja.",
  },
  {
    question: "Trebaju li gosti instalirati aplikaciju?",
    answer:
      "Ne. Digitalni meni radi u web pregledniku na mobitelu, tabletu ili računalu, bez preuzimanja aplikacije.",
  },
  {
    question: "Podržava li digitalni meni više jezika?",
    answer:
      "Da. Meni može imati hrvatsku i englesku verziju, pa ga mogu koristiti i domaći gosti i turisti.",
  },
  {
    question: "Je li potrebna kreditna kartica za početak?",
    answer:
      "Ne. Možete zatražiti besplatni probni period bez unošenja podataka o plaćanju.",
  },
  {
    question: "Nudi li se probni rok za digitalni cjenik?",
    answer:
      "Da. Digitalni cjenik nudi besplatni probni rok od 3 mjeseca, tako da možete isprobati sve funkcionalnosti prije nego što se odlučite za plaćenu verziju ukoliko vam odgovara.",
  },
] as const;

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
        "x-default": siteConfig.url,
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
  pageType:
    | "organization"
    | "website"
    | "softwareApplication"
    | "faq" = "organization",
) {
  const schemas: Record<string, unknown> = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      logo: `${siteConfig.url}/logoqr.png`,
      description: siteConfig.description,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: siteConfig.email,
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
      inLanguage: ["hr", "en"],
    },
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Digital menu software",
      operatingSystem: "Web",
      url: siteConfig.url,
      description: siteConfig.description,
      inLanguage: ["hr", "en"],
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Restaurants, cafes and hospitality businesses",
      },
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  };

  return schemas[pageType] || schemas.organization;
}
