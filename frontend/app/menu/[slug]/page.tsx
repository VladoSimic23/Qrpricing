import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

import { client } from "@/sanity/lib/client";
import {
  messages,
  resolveLocale,
  supportedLocales,
  withLang,
} from "@/lib/i18n";
import { MenuTabs } from "./MenuTabs";

type MenuPayload = {
  name: string;
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

  const nonEmptyCategories = menu.categories.filter(
    (c) =>
      c.items.length > 0 || c.subcategories.some((sub) => sub.items.length > 0),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b1418] via-[#101a1f] to-[#131114] text-[#f7efe4]">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        {nonEmptyCategories.length > 0 ? (
          <section className="px-0">
            <div className="mb-3 flex items-center justify-end">
              <div className="flex items-center gap-2 rounded-full border border-amber-100/15 bg-[#1b191a]/80 p-1 pr-2">
                <span className="pl-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-100/65">
                  {t.languageLabel}
                </span>
                {supportedLocales.slice(0, 2).map((code) => (
                  <Link
                    key={code}
                    href={withLang(`/menu/${slug}`, code)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      code === locale
                        ? "bg-amber-300/20 text-amber-100"
                        : "text-amber-100/70"
                    }`}
                  >
                    {code}
                  </Link>
                ))}
              </div>
            </div>
            <MenuTabs
              categories={nonEmptyCategories}
              venueName={menu.name}
              messages={t}
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
