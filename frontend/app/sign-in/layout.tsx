import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prijava - QR Cjenik",
  description:
    "Prijavite se na vaš QR Cjenik račun i pristupite svojem dashboard-u za upravljanje menijima.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    images: [],
  },
  twitter: {
    images: [],
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
