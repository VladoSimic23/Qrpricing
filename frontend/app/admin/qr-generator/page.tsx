import type { Metadata } from "next";

import { QrGeneratorClient } from "./QrGeneratorClient";

import { requireSuperAdminUserId } from "@/lib/admin";
import { siteConfig } from "@/lib/seo";
import { serverReadClient } from "@/sanity/lib/serverClient";

type TenantOption = {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
};

export const metadata: Metadata = {
  title: "Admin QR Generator",
  description: "Privatni generator SVG QR kodova za klijente.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminQrGeneratorPage() {
  await requireSuperAdminUserId();

  const tenants = await serverReadClient.fetch<TenantOption[]>(
    `*[_type == "tenant" && defined(slug.current)] | order(name asc){
      _id,
      name,
      "slug": slug.current,
      isActive
    }`,
  );

  return (
    <QrGeneratorClient
      tenants={tenants.map((tenant) => ({
        _id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        isActive: tenant.isActive ?? true,
      }))}
      baseUrl={siteConfig.url}
    />
  );
}
