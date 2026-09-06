import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import { Music2, Globe } from "lucide-react";

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

import { messages, resolveLocale, supportedLocales } from "@/lib/i18n";
import { normalizeExchangeRate } from "@/lib/pricing";
import { siteConfig } from "@/lib/seo";
import { serverReadClient } from "@/sanity/lib/serverClient";
import { MenuTabs } from "./MenuTabs";

type MenuPayload = {
  name: string;
  exchangeRateEurToBam?: number;
  logo?: string;
  hideDigitalMenuHeader?: boolean;
  menuDesign?: "classic" | "editorial";
  showPricesBam?: boolean;
  showPricesEur?: boolean;
  alcoholNotice?: string;
  activeLanguages?: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
  dailyOffers: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    sizeVariants?: { label: string; price: number }[];
    isAvailable: boolean;
    imageUrl?: string;
  }[];
  categories: {
    _id: string;
    title: string;
    items: {
      _id: string;
      name: string;
      description?: string;
      price: number;
      currency: string;
      sizeVariants?: { label: string; price: number }[];
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
        sizeVariants?: { label: string; price: number }[];
        isAvailable: boolean;
        imageUrl?: string;
      }[];
    }[];
  }[];
};

export const revalidate = 7200;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1418",
};

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

  try {
    const tempMenu = await serverReadClient.fetch<{
      activeLanguages?: string[];
    } | null>(
      `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{ activeLanguages }`,
      { slug },
    );
    const activeLanguages = tempMenu?.activeLanguages || ["hr", "en"];
    let locale = resolveLocale(lang, requestHeaders.get("accept-language"));
    if (!activeLanguages.includes(locale) && activeLanguages.length > 0) {
      locale = activeLanguages[0] as typeof locale;
    }

    const menu = await serverReadClient.fetch<MenuPayload | null>(
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

  // Prvo dohvacamo tenanta kako bismo znali aktivne jezike
  const tempMenu = await serverReadClient.fetch<{
    activeLanguages?: string[];
  } | null>(
    `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{ activeLanguages }`,
    { slug },
  );

  const activeLanguages = tempMenu?.activeLanguages || ["hr", "en"];
  let locale = resolveLocale(lang, requestHeaders.get("accept-language"));

  if (!activeLanguages.includes(locale) && activeLanguages.length > 0) {
    locale = activeLanguages[0] as typeof locale;
  }

  const t = messages[locale as keyof typeof messages].menu;

  const menu = await serverReadClient.fetch<MenuPayload | null>(
    `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{
      "name": select(
        $locale == "en" => coalesce(nameEn, name),
        name
      ),
      exchangeRateEurToBam,
      "logo": logo.asset->url,
      hideDigitalMenuHeader,
      menuDesign,
      showPricesBam,
      showPricesEur,
      alcoholNotice,
      activeLanguages,
      facebookUrl,
      instagramUrl,
      tiktokUrl,
      websiteUrl,
      "dailyOffers": *[_type == "menuItem" && tenant._ref == ^._id && isDailyOffer == true && isAvailable != false] | order(sortOrder asc, name asc){
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
        sizeVariants[]{label, price},
        isAvailable,
        "imageUrl": image.asset->url
      },
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
          sizeVariants[]{label, price},
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
            sizeVariants[]{label, price},
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
  const categoriesWithDailyOffer =
    menu.dailyOffers.length > 0
      ? [
          {
            _id: "daily-offer",
            title: locale === "en" ? "Daily offer" : "Dnevna ponuda",
            items: menu.dailyOffers,
            subcategories: [],
            isDailyOffer: true,
          },
          ...nonEmptyCategories,
        ]
      : nonEmptyCategories;
  const isEditorial = menu.menuDesign === "editorial";

  return (
    <main
      className={`min-h-screen ${
        isEditorial
          ? "bg-[#f3efe7] text-stone-900"
          : "bg-gradient-to-b from-[#0b1418] via-[#101a1f] to-[#131114] text-[#f7efe4]"
      }`}
    >
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-10 sm:px-6 lg:px-8">
        {categoriesWithDailyOffer.length > 0 ? (
          <section className="px-0">
            <MenuTabs
              categories={categoriesWithDailyOffer}
              venueName={menu.name}
              hideDigitalMenuHeader={menu.hideDigitalMenuHeader}
              menuDesign={menu.menuDesign}
              showPricesBam={menu.showPricesBam ?? false}
              showPricesEur={menu.showPricesEur ?? true}
              exchangeRateEurToBam={exchangeRateEurToBam}
              messages={t}
              locale={locale}
              slug={slug}
              supportedLocales={supportedLocales}
              activeLanguages={menu.activeLanguages || ["hr", "en"]}
            />
          </section>
        ) : (
          <p className="rounded-xl border border-amber-100/10 bg-[#1b191a]/70 px-4 py-3 text-sm text-amber-100/70">
            {t.menuNotAvailable}
          </p>
        )}
      </section>

      <footer
        className={`mt-8 flex flex-col items-center justify-center gap-6 pb-12 px-4 ${
          isEditorial ? "text-stone-600" : ""
        }`}
      >
        {menu.alcoholNotice && (
          <p
            className={`max-w-xl rounded-lg px-4 py-3 text-center text-sm leading-relaxed ${
              isEditorial
                ? "border border-stone-200 bg-white text-stone-600"
                : "border border-amber-100/15 bg-[#151b1f]/70 text-amber-50/75"
            }`}
          >
            {menu.alcoholNotice}
          </p>
        )}
        {(menu.facebookUrl ||
          menu.instagramUrl ||
          menu.tiktokUrl ||
          menu.websiteUrl) && (
          <div className="flex items-center gap-5">
            {menu.instagramUrl && (
              <a
                href={menu.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:text-emerald-600 ${isEditorial ? "text-stone-400" : "text-[#f7efe4]/60"}`}
              >
                <InstagramIcon size={24} />
              </a>
            )}
            {menu.facebookUrl && (
              <a
                href={menu.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:text-emerald-600 ${isEditorial ? "text-stone-400" : "text-[#f7efe4]/60"}`}
              >
                <FacebookIcon size={24} />
              </a>
            )}
            {menu.tiktokUrl && (
              <a
                href={menu.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:text-emerald-600 ${isEditorial ? "text-stone-400" : "text-[#f7efe4]/60"}`}
              >
                <Music2 size={24} />
              </a>
            )}
            {menu.websiteUrl && (
              <a
                href={menu.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors hover:text-emerald-600 ${isEditorial ? "text-stone-400" : "text-[#f7efe4]/60"}`}
              >
                <Globe size={24} />
              </a>
            )}
          </div>
        )}
        <div className="text-center text-xs text-[#f7efe4]/40">
          <p>
            Kreirano pomoću{" "}
            <a
              href="https://digitalcjenik.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              digitalcjenik.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
