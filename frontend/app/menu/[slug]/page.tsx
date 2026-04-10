import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const menu = await client.fetch<MenuPayload | null>(
    `*[_type == "tenant" && slug.current == $slug && isActive != false][0]{
      name,
      "categories": *[_type == "menuCategory" && tenant._ref == ^._id] | order(sortOrder asc, title asc){
        _id,
        title,
        "items": *[_type == "menuItem" && category._ref == ^._id && !defined(subCategory) && isAvailable != false] | order(sortOrder asc, name asc){
          _id,
          name,
          description,
          price,
          currency,
          isAvailable,
          "imageUrl": image.asset->url
        },
        "subcategories": *[_type == "menuSubcategory" && category._ref == ^._id] | order(sortOrder asc, title asc){
          _id,
          title,
          "items": *[_type == "menuItem" && subCategory._ref == ^._id && isAvailable != false] | order(sortOrder asc, name asc){
            _id,
            name,
            description,
            price,
            currency,
            isAvailable,
            "imageUrl": image.asset->url
          }
        }
      }
    }`,
    { slug },
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
            <MenuTabs categories={nonEmptyCategories} venueName={menu.name} />
          </section>
        ) : (
          <p className="rounded-xl border border-amber-100/10 bg-[#1b191a]/70 px-4 py-3 text-sm text-amber-100/70">
            Meni još nije dostupan.
          </p>
        )}
      </section>
    </main>
  );
}
