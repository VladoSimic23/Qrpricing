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
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="rounded-2xl bg-slate-950 px-6 py-8 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
          Digitalni meni
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{menu.name}</h1>
      </header>

      {nonEmptyCategories.length > 0 ? (
        <section className="px-0">
          <MenuTabs categories={nonEmptyCategories} />
        </section>
      ) : (
        <p className="text-slate-500">Meni još nije dostupan.</p>
      )}
    </main>
  );
}
