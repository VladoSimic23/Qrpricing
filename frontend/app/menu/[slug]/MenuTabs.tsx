"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { convertPrice } from "@/lib/pricing";

type Item = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  sizeVariants?: { label: string; price: number }[];
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
  isDailyOffer?: boolean;
};

type SubTab = {
  key: string;
  title: string;
  count: number;
};

type MenuDesign =
  | "classic"
  | "editorial"
  | "bistro"
  | "burger-bar"
  | "sidebar-neon";

function PricePills({
  bam,
  eur,
  showPricesBam,
  showPricesEur,
  design,
  align = "end",
}: {
  bam: number[];
  eur: number[];
  showPricesBam: boolean;
  showPricesEur: boolean;
  design: MenuDesign;
  align?: "start" | "end";
}) {
  if (!showPricesBam && !showPricesEur) {
    return null;
  }

  return (
    <div
      className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold md:gap-2 md:text-sm ${align === "start" ? "justify-start" : "justify-end"} ${design === "burger-bar" ? "flex-nowrap" : "flex-wrap"}`}
    >
      {showPricesBam && (
        <span
          className={`whitespace-nowrap rounded-full border px-2 py-0.5 md:px-3 md:py-1 ${
            design === "sidebar-neon"
              ? "border-[#d98aa8] bg-[#d98aa8] font-black text-[#241326]"
              : design === "burger-bar"
                ? "border-[#f6bf3c] bg-[#f6bf3c] font-black text-[#17130d]"
                : design === "bistro"
                  ? "border-[#dfb28f] bg-[#fff8ef] text-[#8f3d2e]"
                  : design === "editorial"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-amber-200/15 bg-amber-400/15 text-amber-100"
          }`}
        >
          {bam.map((v) => v.toFixed(2)).join(" / ")} KM
        </span>
      )}
      {showPricesEur && (
        <span
          className={`whitespace-nowrap rounded-full border px-2 py-0.5 md:px-3 md:py-1 ${
            design === "sidebar-neon"
              ? "border-[#9b7bc6] bg-[#9b7bc6] font-black text-[#241326]"
              : design === "burger-bar"
                ? "border-[#ff8b1f] bg-[#ff8b1f] font-black text-[#17130d]"
                : design === "bistro"
                  ? "border-[#b9cfa9] bg-[#f3f8ed] text-[#48623b]"
                  : design === "editorial"
                    ? "border-sky-300 bg-sky-50 text-sky-800"
                    : "border-sky-200/15 bg-sky-400/15 text-sky-100"
          }`}
        >
          {eur.map((v) => v.toFixed(2)).join(" / ")} EUR
        </span>
      )}
    </div>
  );
}

function ItemCard({
  item,
  design,
  highlighted = false,
  exchangeRateEurToBam,
  showPricesBam,
  showPricesEur,
  onImageClick,
}: {
  item: Item;
  design: MenuDesign;
  highlighted?: boolean;
  exchangeRateEurToBam: number;
  showPricesBam: boolean;
  showPricesEur: boolean;
  onImageClick?: (imageUrl: string, imageName: string) => void;
}) {
  const converted = (
    item.sizeVariants && item.sizeVariants.length > 0
      ? item.sizeVariants
      : [{ price: item.price }]
  ).map((v) => convertPrice(v.price, item.currency, exchangeRateEurToBam));

  const hasImageOrDesc = !!(item.imageUrl || item.description);
  const isEditorial = design === "editorial";
  const isBistro = design === "bistro";
  const isBurgerBar = design === "burger-bar";
  const isSidebarNeon = design === "sidebar-neon";

  if (isSidebarNeon) {
    return (
      <li
        className={`overflow-hidden rounded-2xl border bg-[#1d1628] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 ${highlighted ? "border-[#d98aa8] ring-1 ring-[#d98aa8]/40" : "border-[#765b96]/45"}`}
      >
        {item.imageUrl && (
          <button
            type="button"
            onClick={() => onImageClick?.(item.imageUrl!, item.name)}
            aria-label={`Uvecaj sliku artikla ${item.name}`}
            className="relative block h-40 w-full overflow-hidden sm:h-48"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover transition duration-300 hover:scale-105"
            />
          </button>
        )}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold leading-snug text-[#f5edf8]">
              {item.name}
            </h3>
            <PricePills
              bam={converted.map((c) => c.bam)}
              eur={converted.map((c) => c.eur)}
              showPricesBam={showPricesBam}
              showPricesEur={showPricesEur}
              design={design}
            />
          </div>
          {item.description && (
            <p className="mt-2 border-t border-[#765b96]/35 pt-2 text-sm leading-relaxed text-[#cbbbd5]">
              {item.description}
            </p>
          )}
          {highlighted && (
            <span className="mt-3 inline-block rounded-full bg-[#d98aa8] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#241326]">
              Dnevna ponuda
            </span>
          )}
        </div>
      </li>
    );
  }

  if (isBurgerBar) {
    if (!item.imageUrl) {
      return (
        <li
          className={`border-l-4 bg-[#1e1a13] px-4 py-4 transition-transform hover:-translate-y-0.5 sm:px-5 ${
            highlighted
              ? "border-l-[#ff8b1f] ring-1 ring-[#ff8b1f]/40"
              : "border-l-[#f6bf3c]"
          }`}
        >
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-base font-black uppercase leading-tight tracking-wide text-[#fff8e7]">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm leading-relaxed text-[#d5c7aa]">
                {item.description}
              </p>
            )}
            <PricePills
              bam={converted.map((c) => c.bam)}
              eur={converted.map((c) => c.eur)}
              showPricesBam={showPricesBam}
              showPricesEur={showPricesEur}
              design={design}
              align="start"
            />
            {highlighted && (
              <span className="bg-[#ff8b1f] px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#17130d]">
                {"Dnevna ponuda"}
              </span>
            )}
          </div>
        </li>
      );
    }

    return (
      <li
        className={`relative mb-5 bg-[#1e1a13] transition-transform hover:-translate-y-0.5 ${
          highlighted ? "ring-1 ring-[#ff8b1f]/40" : ""
        }`}
      >
        <div className="flex min-h-28 items-stretch">
          {item.imageUrl && (
            <div className="relative w-34 shrink-0 overflow-hidden sm:w-44">
              <button
                type="button"
                onClick={() => onImageClick?.(item.imageUrl!, item.name)}
                aria-label={`Uvecaj sliku artikla ${item.name}`}
                className="absolute inset-0 w-full"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="176px"
                  className="object-cover transition duration-300 hover:scale-105"
                />
              </button>
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
            <div>
              <h3 className="text-base font-black uppercase leading-tight tracking-wide text-[#fff8e7]">
                {item.name}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-[#d5c7aa]">
                  {item.description}
                </p>
              )}
            </div>
            {highlighted && (
              <span className="w-fit bg-[#ff8b1f] px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#17130d]">
                {"Dnevna ponuda"}
              </span>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 right-4 z-10 translate-y-1/2 sm:right-5">
          <PricePills
            bam={converted.map((c) => c.bam)}
            eur={converted.map((c) => c.eur)}
            showPricesBam={showPricesBam}
            showPricesEur={showPricesEur}
            design={design}
          />
        </div>
      </li>
    );
  }

  if (isBistro) {
    return (
      <li
        className={`overflow-hidden border bg-[#fffdf9] transition-shadow ${
          highlighted
            ? "border-[#bb4d36] shadow-[0_10px_28px_rgba(164,67,45,0.16)]"
            : "border-[#ead4bf] shadow-[0_5px_18px_rgba(99,53,33,0.06)]"
        }`}
      >
        {item.imageUrl && (
          <button
            type="button"
            onClick={() => onImageClick?.(item.imageUrl!, item.name)}
            aria-label={`Uvecaj sliku artikla ${item.name}`}
            className="relative block h-36 w-full overflow-hidden transition hover:opacity-90 sm:h-44"
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
          </button>
        )}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-lg font-bold leading-snug text-[#4a281d]">
              {item.name}
            </h3>
            <PricePills
              bam={converted.map((c) => c.bam)}
              eur={converted.map((c) => c.eur)}
              showPricesBam={showPricesBam}
              showPricesEur={showPricesEur}
              design={design}
            />
          </div>
          {item.description && (
            <p className="mt-2 border-t border-[#ead4bf] pt-2 text-sm leading-relaxed text-[#875d4b]">
              {item.description}
            </p>
          )}
        </div>
      </li>
    );
  }

  return (
    <li
      key={item._id}
      className={`rounded-2xl border px-4 py-3 transition-shadow ${
        highlighted
          ? isBistro
            ? "border-[#bb4d36] bg-[#fff0df] shadow-[0_8px_24px_rgba(164,67,45,0.12)]"
            : isEditorial
              ? "border-emerald-300 bg-emerald-50 shadow-[0_8px_24px_rgba(16,185,129,0.12)]"
              : "border-emerald-300/30 bg-emerald-950/30 shadow-[0_8px_24px_rgba(16,185,129,0.12)]"
          : isBistro
            ? "border-[#ead4bf] bg-[#fffdf9] shadow-[0_5px_18px_rgba(99,53,33,0.06)]"
            : isEditorial
              ? "border-stone-200 bg-white shadow-[0_8px_24px_rgba(82,67,45,0.06)]"
              : "border-amber-100/10 bg-[#151b1f]/75 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        {item.imageUrl && (
          <button
            type="button"
            onClick={() => onImageClick?.(item.imageUrl!, item.name)}
            aria-label={`Uvecaj sliku artikla ${item.name}`}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 transition hover:opacity-90 ${isBistro ? "ring-[#d9ae8b]" : isEditorial ? "ring-stone-200" : "ring-amber-50/15"}`}
          >
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start justify-between gap-4">
            <h3
              className={`text-[15px] font-semibold leading-snug md:text-[15px] ${isBistro ? "font-serif text-[#4a281d]" : isEditorial ? "text-stone-900" : "text-[#fff6e8]"}`}
            >
              {item.name}
            </h3>
            {!hasImageOrDesc && (
              <PricePills
                bam={converted.map((c) => c.bam)}
                eur={converted.map((c) => c.eur)}
                showPricesBam={showPricesBam}
                showPricesEur={showPricesEur}
                design={design}
              />
            )}
          </div>
          {item.description && (
            <p
              className={`text-sm leading-relaxed ${isBistro ? "text-[#875d4b]" : isEditorial ? "text-stone-600" : "text-amber-50/70"}`}
            >
              {item.description}
            </p>
          )}
          {hasImageOrDesc && (
            <div className="mt-1 flex justify-end">
              <PricePills
                bam={converted.map((c) => c.bam)}
                eur={converted.map((c) => c.eur)}
                showPricesBam={showPricesBam}
                showPricesEur={showPricesEur}
                design={design}
              />
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
  menuDesign,
  hideDigitalMenuHeader,
  showPricesBam,
  showPricesEur,
  exchangeRateEurToBam,
  messages,
  locale,
  slug,
  supportedLocales,
  activeLanguages,
}: {
  categories: Category[];
  venueName: string;
  menuDesign?: MenuDesign;
  hideDigitalMenuHeader?: boolean;
  showPricesBam: boolean;
  showPricesEur: boolean;
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
    languageLabel: string;
  };
  locale: string;
  slug: string;
  supportedLocales: readonly string[];
  activeLanguages: string[];
}) {
  const design: MenuDesign =
    menuDesign === "classic" ||
    menuDesign === "editorial" ||
    menuDesign === "bistro" ||
    menuDesign === "burger-bar" ||
    menuDesign === "sidebar-neon"
      ? menuDesign
      : "bistro";
  const isEditorial = design === "editorial";
  const isBistro = design === "bistro";
  const isBurgerBar = design === "burger-bar";
  const isSidebarNeon = design === "sidebar-neon";
  const [activeId, setActiveId] = useState(
    categories.find((category) => !category.isDailyOffer)?._id ??
      categories[0]?._id ??
      "",
  );
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const active = categories.find((c) => c._id === activeId) ?? categories[0];

  useEffect(() => {
    if (!selectedImage) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchPlaceholder =
    locale === "en" ? "Search items..." : "Pretrazi artikle...";

  const itemMatchesQuery = (item: Item) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.description?.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredRootItems = active?.items.filter(itemMatchesQuery) ?? [];
  const filteredSubcategories =
    active?.subcategories.map((sub) => ({
      ...sub,
      items: sub.items.filter(itemMatchesQuery),
    })) ?? [];
  const visibleSubcategories = filteredSubcategories.filter(
    (sub) => sub.items.length > 0,
  );

  const allItemsCount =
    filteredRootItems.length +
    visibleSubcategories.reduce((sum, sub) => sum + sub.items.length, 0);

  const globalFilteredCategories = categories
    .map((category) => ({
      ...category,
      items: category.items.filter(itemMatchesQuery),
      subcategories: category.subcategories
        .map((sub) => ({
          ...sub,
          items: sub.items.filter(itemMatchesQuery),
        }))
        .filter((sub) => sub.items.length > 0),
    }))
    .filter(
      (category) =>
        category.items.length > 0 || category.subcategories.length > 0,
    );

  const globalItemsCount = globalFilteredCategories.reduce(
    (categoryTotal, category) =>
      categoryTotal +
      category.items.length +
      category.subcategories.reduce(
        (subTotal, sub) => subTotal + sub.items.length,
        0,
      ),
    0,
  );

  const subTabs: SubTab[] = [
    { key: "all", title: messages.all, count: allItemsCount },
    ...visibleSubcategories.map((sub) => ({
      key: `sub-${sub._id}`,
      title: sub.title,
      count: sub.items.length,
    })),
  ];

  const hasSubcategories = visibleSubcategories.length > 0;
  const resolvedActiveSubTab = subTabs.some((tab) => tab.key === activeSubTab)
    ? activeSubTab
    : "all";

  const selectSubTab = (key: string) => {
    setActiveSubTab(key);
  };

  const selectCategory = (categoryId: string) => {
    setActiveId(categoryId);
    setActiveSubTab("all");
  };

  return (
    <div
      className={`space-y-4 ${isBurgerBar ? "font-sans" : isBistro ? "font-sans" : isEditorial ? "font-sans" : ""}`}
    >
      {isSidebarNeon && (
        <>
          <header className="sticky top-0 z-30 -mx-4 border-b border-[#765b96]/45 bg-[#130e1b]/95 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-md sm:-mx-6 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                {!hideDigitalMenuHeader && (
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7a9db]">
                    {messages.digitalMenu}
                  </p>
                )}
                <p className="truncate text-xl font-semibold tracking-tight text-[#f5edf8]">
                  {venueName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label={messages.openCategories}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d98aa8]/70 bg-[#d98aa8] text-[#241326] shadow-[0_6px_18px_rgba(217,138,168,0.2)] transition hover:bg-[#e3a0b9]"
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            </div>
            <label className="mt-4 flex items-center gap-3 rounded-xl border border-[#765b96]/55 bg-[#1d1628] px-3 py-2.5 focus-within:border-[#d98aa8]">
              <Search
                size={18}
                className="shrink-0 text-[#c7a9db]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full bg-transparent text-sm text-[#f5edf8] outline-none placeholder:text-[#cbbbd5]/65"
              />
            </label>
          </header>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-50 bg-[#08060b]/70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
              role="presentation"
            >
              <aside
                className="ml-auto flex h-full w-[min(88vw,22rem)] flex-col border-l border-[#765b96]/55 bg-[#130e1b] p-5 shadow-2xl shadow-black/50"
                onClick={(event) => event.stopPropagation()}
                aria-label={messages.categories}
              >
                <div className="flex items-center justify-between border-b border-[#765b96]/35 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#c7a9db]">
                      {messages.categories}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#f5edf8]">
                      {venueName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label={messages.closeMobileMenu}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#765b96]/55 text-[#c7a9db] transition hover:border-[#d98aa8] hover:text-[#e3a0b9]"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
                <nav className="mt-5 flex-1 space-y-2 overflow-y-auto pr-1">
                  {categories.map((category) => (
                    <div key={category._id}>
                      <button
                        type="button"
                        onClick={() => {
                          selectCategory(category._id);
                          setIsSidebarOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${category._id === activeId ? "bg-[#d98aa8] text-[#241326]" : "text-[#f5edf8] hover:bg-[#765b96]/25"}`}
                      >
                        <span>{category.title}</span>
                        <span className="text-xs opacity-70">
                          {category.items.length +
                            category.subcategories.reduce(
                              (sum, sub) => sum + sub.items.length,
                              0,
                            )}
                        </span>
                      </button>
                      {category.subcategories.length > 0 && (
                        <div className="ml-4 border-l border-[#765b96]/45 pl-3">
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory._id}
                              type="button"
                              onClick={() => {
                                selectCategory(category._id);
                                selectSubTab(`sub-${subcategory._id}`);
                                setIsSidebarOpen(false);
                              }}
                              className="block w-full px-3 py-2 text-left text-sm text-[#cbbbd5] transition hover:text-[#e3a0b9]"
                            >
                              {subcategory.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </aside>
            </div>
          )}
        </>
      )}
      <div
        className={`${isSidebarNeon ? "hidden" : "hidden md:flex"} items-center justify-between gap-6 border px-6 py-5 ${isBurgerBar ? "border-[#f6bf3c]/55 bg-[#1e1a13] shadow-[0_14px_32px_rgba(0,0,0,0.28)]" : isBistro ? "border-[#e3c4aa] bg-[#fffdf8] shadow-[0_12px_30px_rgba(110,57,35,0.08)]" : isEditorial ? "rounded-[28px] border-stone-200 bg-[#f8f5ef]" : "rounded-[28px] border-amber-100/10 bg-[#1b191a]/70 backdrop-blur-sm"}`}
      >
        <div className="min-w-0 w-full">
          {!hideDigitalMenuHeader && (
            <p
              className={`text-[10px] uppercase tracking-[0.22em] ${isBurgerBar ? "text-[#f6bf3c]" : isBistro ? "text-[#a66145]" : isEditorial ? "text-stone-500" : "text-amber-200/70"}`}
            >
              {messages.digitalMenu}
            </p>
          )}
          <p
            className={`mt-1 text-2xl font-bold ${isBurgerBar ? "font-black uppercase tracking-wide text-[#fff8e7]" : isBistro ? "font-serif text-[#4a281d]" : isEditorial ? "text-lg font-semibold text-stone-900" : "text-lg font-semibold text-[#fff6e8]"}`}
          >
            {venueName}
          </p>
        </div>
      </div>

      <div
        className={
          isSidebarNeon
            ? "hidden"
            : "sticky top-0 z-30 -mx-4 md:hidden sm:-mx-6"
        }
      >
        <div
          className={`px-4 py-4 shadow-lg backdrop-blur-md sm:px-6 ${isBurgerBar ? "border-b border-[#f6bf3c]/45 bg-[#12100d]/95" : isBistro ? "border-b border-[#e3c4aa] bg-[#fffaf3]/95" : isEditorial ? "bg-[#f8f5ef]/95" : "bg-[#1b191a]/90"}`}
        >
          <div className="w-full min-w-0">
            {!hideDigitalMenuHeader && (
              <p
                className={`text-[10px] uppercase tracking-[0.22em] ${isBurgerBar ? "text-[#f6bf3c]" : isBistro ? "text-[#a66145]" : isEditorial ? "text-stone-500" : "text-amber-200/70"}`}
              >
                {messages.digitalMenu}
              </p>
            )}
            <p
              className={`truncate text-[18px] ${isBurgerBar ? "font-black uppercase tracking-wide text-[#fff8e7]" : isBistro ? "font-serif font-bold text-[#4a281d]" : isEditorial ? "font-medium text-stone-800" : "font-medium text-amber-100/70"}`}
            >
              {venueName}
            </p>
          </div>

          <div
            className={`mt-2 border-t pt-2 ${isBurgerBar ? "border-[#f6bf3c]/30" : isBistro ? "border-[#ead4bf]" : "border-amber-100/10"}`}
          >
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => selectCategory(cat._id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                    cat._id === activeId
                      ? isBurgerBar
                        ? "border-[#ff8b1f] bg-[#ff8b1f] text-[#17130d] shadow-[0_5px_0_#a94608]"
                        : isBistro
                          ? "border-[#b8422e] bg-[#b8422e] text-white"
                          : isEditorial
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-amber-200/40 bg-amber-200/10 text-amber-100"
                      : isBurgerBar
                        ? "border-[#f6bf3c]/40 bg-[#1e1a13] text-[#f8c85a]"
                        : isBistro
                          ? "border-[#e3c4aa] bg-[#fffdf9] text-[#80523e]"
                          : isEditorial
                            ? "border-stone-200 bg-white text-stone-500"
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
                      tab.key === resolvedActiveSubTab
                        ? isBurgerBar
                          ? "border-[#f6bf3c] bg-[#f6bf3c] text-[#17130d]"
                          : isBistro
                            ? "border-[#b8422e] bg-[#b8422e] text-white"
                            : isEditorial
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-amber-300/50 bg-amber-300/15 text-amber-100"
                        : isBurgerBar
                          ? "border-[#f6bf3c]/35 bg-[#191610] text-[#f8c85a]"
                          : isBistro
                            ? "border-[#e3c4aa] bg-[#fffdf9] text-[#80523e]"
                            : isEditorial
                              ? "border-stone-200 bg-white text-stone-500"
                              : "border-amber-100/15 bg-[#1a1f23] text-amber-50/65"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            )}
            {isSearchOpen && (
              <div
                className={`mt-2 border px-3 py-2 ${isBurgerBar ? "border-[#f6bf3c]/45 bg-[#1e1a13]" : isBistro ? "rounded-2xl border-[#e3c4aa] bg-[#fffdf9]" : "rounded-2xl border-amber-100/10 bg-[#171c20]"}`}
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className={`w-full border px-4 py-2.5 text-sm outline-none transition ${isBurgerBar ? "border-[#f6bf3c]/35 bg-[#12100d] text-[#fff8e7] placeholder:text-[#f8c85a]/60 focus:border-[#ff8b1f]" : isBistro ? "rounded-xl border-[#e3c4aa] bg-[#fff7ed] text-[#4a281d] placeholder:text-[#af765c] focus:border-[#b8422e]" : "rounded-xl border-amber-100/10 bg-[#11171a] text-amber-50 placeholder:text-amber-100/45 focus:border-amber-200/40"}`}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${isSidebarNeon ? "hidden" : "sticky top-0 z-30 -mx-4 hidden px-4 pb-3 pt-3 backdrop-blur-md md:block sm:-mx-6 sm:px-6"} ${isBurgerBar ? "border-b border-[#f6bf3c]/45 bg-[#12100d]/95" : isBistro ? "border-b border-[#e3c4aa] bg-[#fffaf3]/95" : isEditorial ? "bg-[#f8f5ef]/95" : "bg-[#141316]/90"}`}
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => selectCategory(cat._id)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                cat._id === activeId
                  ? isBurgerBar
                    ? "border-[#ff8b1f] bg-[#ff8b1f] text-[#17130d] shadow-[0_5px_0_#a94608]"
                    : isBistro
                      ? "border-[#b8422e] bg-[#b8422e] text-white"
                      : isEditorial
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-amber-200/40 bg-amber-200/10 text-amber-100"
                  : isBurgerBar
                    ? "border-[#f6bf3c]/40 bg-[#1e1a13] text-[#f8c85a] hover:border-[#f6bf3c] hover:bg-[#292218]"
                    : isBistro
                      ? "border-[#e3c4aa] bg-[#fffdf9] text-[#80523e] hover:bg-[#fde9d7]"
                      : isEditorial
                        ? "border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                        : "border-amber-100/15 bg-[#1a1f23] text-amber-50/70 hover:bg-[#20262b]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {subTabs.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {subTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => selectSubTab(tab.key)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  tab.key === resolvedActiveSubTab
                    ? isBurgerBar
                      ? "border-[#f6bf3c] bg-[#f6bf3c] text-[#17130d]"
                      : isBistro
                        ? "border-[#b8422e] bg-[#b8422e] text-white"
                        : isEditorial
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-amber-300/50 bg-amber-300/15 text-amber-100"
                    : isBurgerBar
                      ? "border-[#f6bf3c]/35 bg-[#191610] text-[#f8c85a] hover:border-[#f6bf3c]"
                      : isBistro
                        ? "border-[#e3c4aa] bg-[#fffdf9] text-[#80523e] hover:bg-[#fde9d7]"
                        : isEditorial
                          ? "border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                          : "border-amber-100/15 bg-[#1b2125] text-amber-50/65 hover:bg-[#20272d]"
                }`}
              >
                {tab.title}
                <span
                  className={`ml-1.5 text-[11px] ${isBurgerBar ? (tab.key === resolvedActiveSubTab ? "text-[#17130d]/70" : "text-[#f6bf3c]/65") : isBistro ? (tab.key === resolvedActiveSubTab ? "text-white/75" : "text-[#af765c]") : tab.key === resolvedActiveSubTab ? "text-amber-200" : "text-amber-50/45"}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {isSearchOpen && (
          <div
            className={`mt-2 border px-3 py-2 ${isBurgerBar ? "border-[#f6bf3c]/45 bg-[#1e1a13]" : isBistro ? "rounded-2xl border-[#e3c4aa] bg-[#fffdf9]" : "rounded-2xl border-amber-100/10 bg-[#171c20]"}`}
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full border px-4 py-2.5 text-sm outline-none transition ${isBurgerBar ? "border-[#f6bf3c]/35 bg-[#12100d] text-[#fff8e7] placeholder:text-[#f8c85a]/60 focus:border-[#ff8b1f]" : isBistro ? "rounded-xl border-[#e3c4aa] bg-[#fff7ed] text-[#4a281d] placeholder:text-[#af765c] focus:border-[#b8422e]" : "rounded-xl border-amber-100/10 bg-[#11171a] text-amber-50 placeholder:text-amber-100/45 focus:border-amber-200/40"}`}
            />
          </div>
        )}
      </div>

      <div className={isSidebarNeon ? "space-y-5" : isBurgerBar ? "space-y-5" : "space-y-3"}>
        {!normalizedQuery && active && (
          <div className="border-b border-[#765b96]/45 pb-3 pt-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#c7a9db]">
              {messages.categories}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f5edf8] sm:text-3xl">
              {active.title}
            </h1>
          </div>
        )}
        {normalizedQuery ? (
          globalFilteredCategories.map((category) => (
            <div key={category._id}>
              <h2
                className={`mb-3 text-lg font-semibold ${isSidebarNeon ? "border-b border-[#765b96]/45 px-1 pb-3 text-2xl text-[#f5edf8]" : isBurgerBar ? "border-b-2 border-[#f6bf3c] px-5 py-4 text-2xl font-black uppercase tracking-wide text-[#fff8e7]" : isBistro ? "font-serif text-2xl text-[#4a281d]" : isEditorial ? "text-stone-800" : "text-amber-100"}`}
              >
                {category.title}
              </h2>
              {category.items.length > 0 && (
                <ul className={isBurgerBar ? "space-y-6" : "space-y-2"}>
                  {category.items.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      design={design}
                      exchangeRateEurToBam={exchangeRateEurToBam}
                      showPricesBam={showPricesBam}
                      showPricesEur={showPricesEur}
                      highlighted={category.isDailyOffer}
                      onImageClick={(url, name) =>
                        setSelectedImage({ url, name })
                      }
                    />
                  ))}
                </ul>
              )}
              {category.subcategories.map((sub) => (
                <div key={sub._id} className={isSidebarNeon ? "mt-7" : isBurgerBar ? "mt-6" : "mt-3"}>
                  <p
                    className={`mb-3 text-[15px] font-semibold ${isSidebarNeon ? "inline-block border-b-2 border-[#d98aa8] pb-1 text-lg tracking-wide text-[#e3c4d9]" : isBurgerBar ? "inline-block border-b-4 border-[#ff8b1f] pb-1 text-xl font-black uppercase tracking-wide text-[#f6bf3c]" : isBistro ? "font-serif text-2xl text-[#8a5a44]" : isEditorial ? "text-stone-700" : "text-amber-100/65"}`}
                  >
                    {sub.title}
                  </p>
                  <ul className={isBurgerBar ? "space-y-6" : "space-y-2"}>
                    {sub.items.map((item) => (
                      <ItemCard
                        key={item._id}
                        item={item}
                        design={design}
                        exchangeRateEurToBam={exchangeRateEurToBam}
                        showPricesBam={showPricesBam}
                        showPricesEur={showPricesEur}
                        highlighted={category.isDailyOffer}
                        onImageClick={(url, name) =>
                          setSelectedImage({ url, name })
                        }
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        ) : resolvedActiveSubTab === "all" && filteredRootItems.length > 0 ? (
          <ul className={isBurgerBar ? "space-y-6" : "space-y-2"}>
            {filteredRootItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                design={design}
                exchangeRateEurToBam={exchangeRateEurToBam}
                showPricesBam={showPricesBam}
                showPricesEur={showPricesEur}
                highlighted={active.isDailyOffer}
                onImageClick={(url, name) => setSelectedImage({ url, name })}
              />
            ))}
          </ul>
        ) : (
          <>
            {visibleSubcategories
              .filter(
                (sub) =>
                  resolvedActiveSubTab === "all" ||
                  resolvedActiveSubTab === `sub-${sub._id}`,
              )
              .map((sub) => (
                <div key={sub._id}>
                  <p
                    className={`mb-3 font-semibold ${isSidebarNeon ? "inline-block border-b-2 border-[#d98aa8] pb-1 text-lg tracking-wide text-[#e3c4d9]" : isBurgerBar ? "inline-block border-b-4 border-[#ff8b1f] pb-1 text-xl font-black uppercase tracking-wide text-[#f6bf3c]" : isBistro ? "font-serif text-2xl text-[#8a5a44]" : isEditorial ? "text-stone-700" : "text-amber-100/65"}`}
                  >
                    {sub.title}
                  </p>
                  <ul className={isBurgerBar ? "space-y-6" : "space-y-2"}>
                    {sub.items.map((item) => (
                      <ItemCard
                        key={item._id}
                        item={item}
                        design={design}
                        exchangeRateEurToBam={exchangeRateEurToBam}
                        showPricesBam={showPricesBam}
                        showPricesEur={showPricesEur}
                        highlighted={active.isDailyOffer}
                        onImageClick={(url, name) =>
                          setSelectedImage({ url, name })
                        }
                      />
                    ))}
                  </ul>
                </div>
              ))}
          </>
        )}

        {(normalizedQuery ? globalItemsCount : allItemsCount) === 0 && (
          <p
            className={`border px-3 py-3 text-sm ${isSidebarNeon ? "rounded-xl border-[#765b96]/45 bg-[#1d1628] text-[#cbbbd5]" : isBurgerBar ? "border-[#f6bf3c]/35 bg-[#1e1a13] text-[#f8c85a]" : isBistro ? "rounded-xl border-[#e3c4aa] bg-[#fffdf9] text-[#8a5a44]" : isEditorial ? "rounded-xl border-stone-200 bg-white text-stone-500" : "rounded-xl border-amber-100/10 bg-[#17181b] text-amber-50/65"}`}
          >
            {messages.noItemsInCategory}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsSearchOpen((prev) => !prev)}
        aria-label={isSearchOpen ? messages.close : searchPlaceholder}
        className={`${isSidebarNeon ? "hidden" : "fixed bottom-0 left-4 z-40 inline-flex"} h-10 w-10 items-center justify-center rounded-full border shadow-lg transition ${isBurgerBar ? "border-[#f6bf3c] bg-[#f6bf3c] text-[#17130d] hover:bg-[#ff8b1f]" : isBistro ? "border-[#dfb28f] bg-[#fff7ed] text-[#98412f] hover:bg-[#fde9d7]" : isEditorial ? "border-stone-300 bg-white text-stone-700 hover:bg-stone-100" : "border-amber-100/15 bg-[#141213] text-amber-100/80 hover:border-amber-100/30 hover:text-amber-100"}`}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.2-3.2" />
        </svg>
      </button>

      {activeLanguages.length > 1 && (
        <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
          {isLangOpen && (
            <div
              className={`flex flex-col gap-1 rounded-2xl border p-1 shadow-lg ${isSidebarNeon ? "border-[#765b96]/55 bg-[#130e1b]" : isBurgerBar ? "border-[#f6bf3c]/45 bg-[#12100d]" : isBistro ? "border-[#dfb28f] bg-[#fff7ed]" : isEditorial ? "border-stone-200 bg-white" : "border-amber-100/15 bg-[#141213]"}`}
            >
              {supportedLocales
                .filter((code) => activeLanguages.includes(code))
                .map((code) => (
                  <Link
                    key={code}
                    href={`/menu/${slug}?lang=${code}`}
                    onClick={() => setIsLangOpen(false)}
                    className={`rounded-xl px-3 py-1.5 text-center text-xs font-semibold uppercase tracking-wide transition ${
                      code === locale
                        ? isBurgerBar
                          ? isSidebarNeon
                            ? "bg-[#d98aa8] text-[#241326]"
                            : "bg-[#ff8b1f] text-[#17130d]"
                          : isBistro
                            ? "bg-[#b8422e] text-white"
                            : isEditorial
                              ? "bg-stone-900 text-white"
                              : "bg-amber-300/20 text-amber-100"
                        : isSidebarNeon
                          ? "text-[#cbbbd5] hover:bg-[#765b96]/20 hover:text-[#f5edf8]"
                          : isBurgerBar
                          ? "text-[#f8c85a] hover:bg-[#f6bf3c]/15"
                          : isBistro
                            ? "text-[#8a5a44] hover:bg-[#fde9d7]"
                            : isEditorial
                              ? "text-stone-600 hover:bg-stone-100"
                              : "text-amber-100/70 hover:bg-amber-50/5 hover:text-amber-100"
                    }`}
                  >
                    {code}
                  </Link>
                ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsLangOpen((prev) => !prev)}
            aria-label={messages.languageLabel}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-bold uppercase shadow-lg transition ${isSidebarNeon ? "border-[#d98aa8] bg-[#d98aa8] text-[#241326] hover:bg-[#e3a0b9]" : isBurgerBar ? "border-[#f6bf3c] bg-[#f6bf3c] text-[#17130d] hover:bg-[#ff8b1f]" : isBistro ? "border-[#dfb28f] bg-[#fff7ed] text-[#98412f] hover:bg-[#fde9d7]" : isEditorial ? "border-stone-300 bg-white text-stone-700 hover:bg-stone-100" : "border-amber-100/15 bg-[#141213] text-amber-100/80 hover:border-amber-100/30 hover:text-amber-100"}`}
          >
            {locale}
          </button>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Prikaz slike artikla ${selectedImage.name}`}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Zatvori sliku"
              className={`absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border ${isSidebarNeon ? "border-[#765b96]/55 bg-[#1d1628] text-[#f5edf8]" : "border-amber-100/30 bg-[#15171a] text-amber-100"}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>

            <div className={`relative h-[75vh] w-full overflow-hidden rounded-2xl border ${isSidebarNeon ? "border-[#765b96]/45 bg-[#130e1b]" : "border-amber-100/20 bg-[#0f1113]"}`}>
              <Image
                src={selectedImage.url}
                alt={selectedImage.name}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
