import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist_Mono, Manrope, Sora } from "next/font/google";
import Script from "next/script";
import { generateMetadata, generateJsonLd } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateJsonLd("organization");
  const websiteSchema = generateJsonLd("website");

  return (
    <ClerkProvider>
      <html
        lang="hr"
        className={`${manrope.variable} ${sora.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          {/* Favicon */}
          <link rel="icon" href="/logoqr.png" type="image/png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

          {/* Preconnect za performanse */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Meta tagovi za mobilne uređaje */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#0f172a" />

          {/* Structured Data - Organization */}
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />

          {/* Structured Data - Website */}
          <Script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />

          {/* Google Site Verification */}
          {/* <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" /> */}

          {/* Analytics */}
          {/* Google Analytics */}
          {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID" /> */}
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
