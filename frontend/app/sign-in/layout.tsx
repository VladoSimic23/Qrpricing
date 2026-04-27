import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Prijava - QR Cjenik",
  description:
    "Prijavite se na vaš QR Cjenik račun i pristupite svojem dashboard-u za upravljanje menijima.",
  robots: {
    index: false,
    follow: true,
  },
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
