import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { messages, resolveLocale, supportedLocales } from "@/lib/i18n";
import { normalizeExchangeRate } from "@/lib/pricing";
import { siteConfig } from "@/lib/seo";
import { MenuTabs } from "./MenuTabs";

type MenuPayload = {
  name: string;
  exchangeRateEurToBam?: number;
  logo?: string;
  hideDigitalMenuHeader?: boolean;
  categories: {
    _id: string;
    title: string;
    items: {
      _id: string;
      name: string;
      description?: string;
      price: number;
      currency: string;
      isAvailable: boolean;
      imageUrl?: string;
    }[];
    subcategories: {
      _id: string;
      title: string;
      items: {
        _id: string;
        name: string;
        description?: string;
        price: number;
        currency: string;
        isAvailable: boolean;
        imageUrl?: string;
      }[];
    }[];
  }[];
};

export const revalidate = 60;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));

  try {
    const menu = await client.fetch<MenuPayload | null>(
      `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{
        "name": select(
          $locale == "en" => coalesce(nameEn, name),
          name
        ),
        "logo": logo.asset->url
      }`,
      { slug, locale },
    );

    if (!menu) {
      return {
        title: "Meni - QR Cjenik",
        description: "Digitalni meni",
      };
    }

    const title = `${menu.name} - Digitalni Meni | QR Cjenik`;
    const description = `Interaktivni digitalni meni za ${menu.name}. Vidi cijene, dostupne artikle i narušite na QR kodu.`;

    return {
      title,
      description,
      keywords: [
        "meni",
        menu.name,
        "restoran",
        "kafić",
        "digitalni meni",
        "QR kod",
        "cijene",
      ],
      openGraph: {
        title,
        description,
        type: "website",
        url: `${siteConfig.url}/menu/${slug}`,
        images: menu.logo
          ? [
              {
                url: menu.logo,
                width: 600,
                height: 400,
                alt: menu.name,
              },
            ]
          : [
              {
                url: `${siteConfig.url}/og-image.png`,
                width: 1200,
                height: 630,
                alt: menu.name,
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: menu.logo ? [menu.logo] : [`${siteConfig.url}/og-image.png`],
      },
      alternates: {
        canonical: `${siteConfig.url}/menu/${slug}`,
      },
    };
  } catch {
    return {
      title: "Meni - QR Cjenik",
      description: "Digitalni meni",
    };
  }
}

export default async function PublicMenuPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const t = messages[locale].menu;

  const menu = await client.fetch<MenuPayload | null>(
    `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{
      "name": select(
        $locale == "en" => coalesce(nameEn, name),
        name
      ),
      exchangeRateEurToBam,
      "logo": logo.asset->url,
      hideDigitalMenuHeader,
      "categories": *[_type == "menuCategory" && tenant._ref == ^._id] | order(sortOrder asc, title asc){
        _id,
        "title": select(
          $locale == "en" => coalesce(titleEn, title),
          title
        ),
        "items": *[_type == "menuItem" && category._ref == ^._id && !defined(subCategory) && isAvailable != false] | order(sortOrder asc, name asc){
          _id,
          "name": select(
            $locale == "en" => coalesce(nameEn, name),
            name
          ),
          "description": select(
            $locale == "en" => coalesce(descriptionEn, description),
            description
          ),
          price,
          currency,
          isAvailable,
          "imageUrl": image.asset->url
        },
        "subcategories": *[_type == "menuSubcategory" && category._ref == ^._id] | order(sortOrder asc, title asc){
          _id,
          "title": select(
            $locale == "en" => coalesce(titleEn, title),
            title
          ),
          "items": *[_type == "menuItem" && subCategory._ref == ^._id && isAvailable != false] | order(sortOrder asc, name asc){
            _id,
            "name": select(
              $locale == "en" => coalesce(nameEn, name),
              name
            ),
            "description": select(
              $locale == "en" => coalesce(descriptionEn, description),
              description
            ),
            price,
            currency,
            isAvailable,
            "imageUrl": image.asset->url
          }
        }
      }
    }`,
    { slug, locale },
  );

  if (!menu) {
    notFound();
  }

  const exchangeRateEurToBam = normalizeExchangeRate(menu.exchangeRateEurToBam);

  const nonEmptyCategories = menu.categories.filter(
    (c) =>
      c.items.length > 0 || c.subcategories.some((sub) => sub.items.length > 0),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1418] via-[#101a1f] to-[#131114] text-[#f7efe4]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 sm:px-6">
        {nonEmptyCategories.length > 0 ? (
          <section className="px-0">
            <MenuTabs
              categories={nonEmptyCategories}
              venueName={menu.name}
              hideDigitalMenuHeader={menu.hideDigitalMenuHeader}
              exchangeRateEurToBam={exchangeRateEurToBam}
              messages={t}
              locale={locale}
              slug={slug}
              supportedLocales={supportedLocales}
            />
          </section>
        ) : (
          <p className="rounded-xl border border-amber-100/10 bg-[#1b191a]/70 px-4 py-3 text-sm text-amber-100/70">
            {t.menuNotAvailable}
          </p>
        )}
      </section>
    </main>
  );
}
