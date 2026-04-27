import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Dashboard - QR Cjenik",
  description:
    "Upravljajte vašim digitalnim menijima, kategorijama, artiklima i postavkama u dashboard-u.",
  robots: {
    index: false,
    follow: false,
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
