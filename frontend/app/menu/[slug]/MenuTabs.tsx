"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { convertPrice } from "@/lib/pricing";

type Item = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  imageUrl?: string;
};

type Subcategory = {
  _id: string;
  title: string;
  items: Item[];
};

type Category = {
  _id: string;
  title: string;
  items: Item[];
  subcategories: Subcategory[];
};

type SubTab = {
  key: string;
  title: string;
  count: number;
};

function ItemCard({
  item,
  exchangeRateEurToBam,
}: {
  item: Item;
  exchangeRateEurToBam: number;
}) {
  const converted = convertPrice(
    item.price,
    item.currency,
    exchangeRateEurToBam,
  );

  const hasImageOrDesc = !!(item.imageUrl || item.description);

  return (
    <li
      key={item._id}
      className="rounded-2xl border border-amber-100/10 bg-[#151b1f]/75 p-4 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        {item.imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 ring-amber-50/15">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[17px] font-semibold leading-snug text-[#fff6e8] md:text-[15px]">
              {item.name}
            </h3>
            {!hasImageOrDesc && (
              <span className="shrink-0 rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200">
                {converted.bam.toFixed(2)} KM&nbsp;|&nbsp;
                {converted.eur.toFixed(2)} EUR
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm leading-relaxed text-amber-50/70">
              {item.description}
            </p>
          )}
          {hasImageOrDesc && (
            <div className="mt-1 flex justify-end">
              <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200">
                {converted.bam.toFixed(2)} KM&nbsp;|&nbsp;
                {converted.eur.toFixed(2)} EUR
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function MenuTabs({
  categories,
  venueName,
  exchangeRateEurToBam,
  messages,
  locale,
  slug,
  supportedLocales,
}: {
  categories: Category[];
  venueName: string;
  exchangeRateEurToBam: number;
  messages: {
    digitalMenu: string;
    categories: string;
    subcategories: string;
    close: string;
    all: string;
    noSubcategory: string;
    noItemsAvailable: string;
    noItemsInCategory: string;
    openCategories: string;
    openSubcategories: string;
    closeMobileMenu: string;
  };
  locale: string;
  slug: string;
  supportedLocales: readonly string[];
}) {
  const [activeId, setActiveId] = useState(categories[0]?._id ?? "");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const active = categories.find((c) => c._id === activeId) ?? categories[0];

  if (!active) return null;

  const allItemsCount =
    active.items.length +
    active.subcategories.reduce((sum, sub) => sum + sub.items.length, 0);

  const subTabs: SubTab[] = [
    { key: "all", title: messages.all, count: allItemsCount },
    ...active.subcategories.map((sub) => ({
      key: `sub-${sub._id}`,
      title: sub.title,
      count: sub.items.length,
    })),
  ];

  const hasSubcategories = active.subcategories.length > 0;

  const selectSubTab = (key: string) => {
    setActiveSubTab(key);
  };

  const selectCategory = (categoryId: string) => {
    setActiveId(categoryId);
    setActiveSubTab("all");
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-30 -mx-4 md:hidden sm:-mx-6">
        <div className="bg-[#1b191a]/90 px-4 py-2.5 shadow-lg backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 pr-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/70">
                {messages.digitalMenu}
              </p>
              <p className="truncate text-[11px] text-amber-100/70">
                {venueName}
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-amber-100/15 bg-[#141213]/90 p-1">
              {supportedLocales.slice(0, 2).map((code) => (
                <Link
                  key={code}
                  href={`/menu/${slug}?lang=${code}`}
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

          <div className="mt-2 border-t border-amber-100/10 pt-2">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => selectCategory(cat._id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                    cat._id === activeId
                      ? "border-amber-200/40 bg-amber-200/10 text-amber-100"
                      : "border-amber-100/15 bg-[#1a1f23] text-amber-50/70"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
            {hasSubcategories && (
              <div className="mt-1.5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {subTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => selectSubTab(tab.key)}
                    className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      tab.key === activeSubTab
                        ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                        : "border-amber-100/15 bg-[#1a1f23] text-amber-50/65"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => selectCategory(cat._id)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              cat._id === activeId
                ? "border-amber-200/40 bg-amber-200/10 text-amber-100"
                : "border-amber-100/15 bg-[#1a1f23] text-amber-50/70 hover:bg-[#20262b]"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {subTabs.length > 1 && (
        <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectSubTab(tab.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                tab.key === activeSubTab
                  ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
                  : "border-amber-100/15 bg-[#1b2125] text-amber-50/65 hover:bg-[#20272d]"
              }`}
            >
              {tab.title}
              <span
                className={`ml-1.5 text-[11px] ${tab.key === activeSubTab ? "text-amber-200" : "text-amber-50/45"}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {activeSubTab === "all" && active.items.length > 0 && (
          <ul className="space-y-3">
            {active.items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                exchangeRateEurToBam={exchangeRateEurToBam}
              />
            ))}
          </ul>
        )}

        {active.subcategories
          .filter(
            (sub) =>
              activeSubTab === "all" || activeSubTab === `sub-${sub._id}`,
          )
          .map((sub) => (
            <div key={sub._id}>
              <p className="mb-2 text-[15px] font-semibold text-amber-100/65">
                {sub.title}
              </p>
              {sub.items.length === 0 ? (
                <p className="rounded-xl border border-amber-100/10 bg-[#17181b] px-3 py-3 text-sm text-amber-50/65">
                  {messages.noItemsAvailable}
                </p>
              ) : (
                <ul className="space-y-3">
                  {sub.items.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      exchangeRateEurToBam={exchangeRateEurToBam}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}

        {allItemsCount === 0 && (
          <p className="rounded-xl border border-amber-100/10 bg-[#17181b] px-3 py-3 text-sm text-amber-50/65">
            {messages.noItemsInCategory}
          </p>
        )}
      </div>
    </div>
  );
}
