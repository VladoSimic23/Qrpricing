import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Admin Studio - QR Cjenik",
  description: "Sanity Studio administracijski panel za upravljanje sadržajem.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
