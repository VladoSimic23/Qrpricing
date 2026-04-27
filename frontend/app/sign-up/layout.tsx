import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Besplatna Registracija - QR Cjenik",
  description:
    "Kreirajte besplatno račun na QR Cjenik-u i počnite sa kreiranjem digitalnih menija za vaš restoran ili kafić.",
  keywords: ["registracija", "besplatna proba", "digitalni meni", "QR cjenik"],
  robots: {
    index: false,
    follow: true,
  },
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
