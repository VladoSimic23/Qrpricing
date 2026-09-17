import type { Metadata } from "next";

import { ToastProvider } from "./Toast";

export const metadata: Metadata = {
  title: "Dashboard - QR Cjenik",
  description:
    "Upravljajte vašim digitalnim menijima, kategorijama, artiklima i postavkama u dashboard-u.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    images: [],
  },
  twitter: {
    images: [],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToastProvider>{children}</ToastProvider>;
}
