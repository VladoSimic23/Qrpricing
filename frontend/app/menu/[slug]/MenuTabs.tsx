"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

type MenuDesign = "classic" | "editorial";

function PricePills({
  bam,
  eur,
  showPricesBam,
  showPricesEur,
  design,
}: {
  bam: number[];
  eur: number[];
  showPricesBam: boolean;
  showPricesEur: boolean;
  design: MenuDesign;
}) {
  if (!showPricesBam && !showPricesEur) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 text-xs font-semibold md:gap-2 md:text-sm">
      {showPricesBam && (
        <span
          className={`rounded-full border px-2.5 py-0.5 md:px-3 md:py-1 ${
            design === "editorial"
              ? "border-amber-300 bg-amber-50 text-amber-800"
              : "border-amber-200/15 bg-amber-400/15 text-amber-100"
          }`}
        >
          {bam.map((v) => v.toFixed(2)).join(" / ")} KM
        </span>
      )}
      {showPricesEur && (
        <span
          className={`rounded-full border px-2.5 py-0.5 md:px-3 md:py-1 ${
            design === "editorial"
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

  return (
    <li
      key={item._id}
      className={`rounded-2xl border px-4 py-3 transition-shadow ${
        highlighted
          ? isEditorial
            ? "border-emerald-300 bg-emerald-50 shadow-[0_8px_24px_rgba(16,185,129,0.12)]"
            : "border-emerald-300/30 bg-emerald-950/30 shadow-[0_8px_24px_rgba(16,185,129,0.12)]"
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
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-1 transition hover:opacity-90 ${isEditorial ? "ring-stone-200" : "ring-amber-50/15"}`}
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
              className={`text-[15px] font-semibold leading-snug md:text-[15px] ${isEditorial ? "text-stone-900" : "text-[#fff6e8]"}`}
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
              className={`text-sm leading-relaxed ${isEditorial ? "text-stone-600" : "text-amber-50/70"}`}
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
  const design = menuDesign === "editorial" ? "editorial" : "classic";
  const isEditorial = design === "editorial";
  const [activeId, setActiveId] = useState(
    categories.find((category) => !category.isDailyOffer)?._id ??
      categories[0]?._id ??
      "",
  );
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    <div className={`space-y-3 ${isEditorial ? "font-sans" : ""}`}>
      <div
        className={`hidden items-center justify-between gap-6 rounded-[28px] border px-6 py-5 md:flex ${isEditorial ? "border-stone-200 bg-[#f8f5ef]" : "border-amber-100/10 bg-[#1b191a]/70 backdrop-blur-sm"}`}
      >
        <div className="min-w-0">
          {!hideDigitalMenuHeader && (
            <p
              className={`text-[10px] uppercase tracking-[0.22em] ${isEditorial ? "text-stone-500" : "text-amber-200/70"}`}
            >
              {messages.digitalMenu}
            </p>
          )}
          <p
            className={`mt-1 text-lg font-semibold ${isEditorial ? "text-stone-900" : "text-[#fff6e8]"}`}
          >
            {venueName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label={isSearchOpen ? messages.close : searchPlaceholder}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-100/15 bg-[#141213]/90 text-amber-100/80 transition hover:border-amber-100/30 hover:text-amber-100"
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
            <>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/55">
                {messages.languageLabel}
              </span>
              <div className="flex items-center gap-1 rounded-full border border-amber-100/15 bg-[#141213]/90 p-1">
                {supportedLocales
                  .filter((code) => activeLanguages.includes(code))
                  .slice(0, 2)
                  .map((code) => (
                    <Link
                      key={code}
                      href={`/menu/${slug}?lang=${code}`}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                        code === locale
                          ? "bg-amber-300/20 text-amber-100"
                          : "text-amber-100/70 hover:bg-amber-50/5 hover:text-amber-100"
                      }`}
                    >
                      {code}
                    </Link>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sticky top-0 z-30 -mx-4 md:hidden sm:-mx-6">
        <div
          className={`px-4 py-4 shadow-lg backdrop-blur-md sm:px-6 ${isEditorial ? "bg-[#f8f5ef]/95" : "bg-[#1b191a]/90"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 pr-3">
              {!hideDigitalMenuHeader && (
                <p
                  className={`text-[10px] uppercase tracking-[0.22em] ${isEditorial ? "text-stone-500" : "text-amber-200/70"}`}
                >
                  {messages.digitalMenu}
                </p>
              )}
              <p
                className={`truncate text-[18px] font-medium ${isEditorial ? "text-stone-800" : "text-amber-100/70"}`}
              >
                {venueName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSearchOpen((prev) => !prev)}
                aria-label={isSearchOpen ? messages.close : searchPlaceholder}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-100/15 bg-[#141213]/90 text-amber-100/80"
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
                <div className="flex items-center gap-1 rounded-full border border-amber-100/15 bg-[#141213]/90 p-1">
                  {supportedLocales
                    .filter((code) => activeLanguages.includes(code))
                    .slice(0, 2)
                    .map((code) => (
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
              )}
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
                      ? isEditorial
                        ? "border-stone-900 bg-stone-900 text-white"
                        : "border-amber-200/40 bg-amber-200/10 text-amber-100"
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
                        ? isEditorial
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-amber-300/50 bg-amber-300/15 text-amber-100"
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
                ? isEditorial
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-amber-200/40 bg-amber-200/10 text-amber-100"
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
        <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectSubTab(tab.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                tab.key === resolvedActiveSubTab
                  ? isEditorial
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-amber-300/50 bg-amber-300/15 text-amber-100"
                  : isEditorial
                    ? "border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                    : "border-amber-100/15 bg-[#1b2125] text-amber-50/65 hover:bg-[#20272d]"
              }`}
            >
              {tab.title}
              <span
                className={`ml-1.5 text-[11px] ${tab.key === resolvedActiveSubTab ? "text-amber-200" : "text-amber-50/45"}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {isSearchOpen && (
        <div className="rounded-2xl border border-amber-100/10 bg-[#171c20] px-3 py-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-amber-100/10 bg-[#11171a] px-4 py-2.5 text-sm text-amber-50 placeholder:text-amber-100/45 outline-none transition focus:border-amber-200/40"
          />
        </div>
      )}

      <div className="space-y-3">
        {normalizedQuery ? (
          globalFilteredCategories.map((category) => (
            <div key={category._id}>
              <h2
                className={`mb-2 text-lg font-semibold ${isEditorial ? "text-stone-800" : "text-amber-100"}`}
              >
                {category.title}
              </h2>
              {category.items.length > 0 && (
                <ul className="space-y-2">
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
                <div key={sub._id} className="mt-3">
                  <p
                    className={`mb-2 text-[15px] font-semibold ${isEditorial ? "text-stone-700" : "text-amber-100/65"}`}
                  >
                    {sub.title}
                  </p>
                  <ul className="space-y-2">
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
          <ul className="space-y-2">
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
                    className={`mb-2 text-[15px] font-semibold ${isEditorial ? "text-stone-700" : "text-amber-100/65"}`}
                  >
                    {sub.title}
                  </p>
                  <ul className="space-y-2">
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
            className={`rounded-xl border px-3 py-3 text-sm ${isEditorial ? "border-stone-200 bg-white text-stone-500" : "border-amber-100/10 bg-[#17181b] text-amber-50/65"}`}
          >
            {messages.noItemsInCategory}
          </p>
        )}
      </div>

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
              className="absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-100/30 bg-[#15171a] text-amber-100"
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

            <div className="relative h-[75vh] w-full overflow-hidden rounded-2xl border border-amber-100/20 bg-[#0f1113]">
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
