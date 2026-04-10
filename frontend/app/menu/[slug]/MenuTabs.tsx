"use client";

import { useState } from "react";
import Image from "next/image";

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

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-5">
      <span
        className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-amber-100 transition-transform duration-300 ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-amber-100 transition-opacity duration-300 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-amber-100 transition-transform duration-300 ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function ItemCard({ item }: { item: Item }) {
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
        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-snug text-[#fff6e8] md:text-[15px]">
              {item.name}
            </h3>
            {item.description && (
              <p className="mt-1 text-sm leading-relaxed text-amber-50/70">
                {item.description}
              </p>
            )}
          </div>
          <p className="shrink-0 rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-200">
            {item.price} {item.currency}
          </p>
        </div>
      </div>
    </li>
  );
}

export function MenuTabs({
  categories,
  venueName,
}: {
  categories: Category[];
  venueName: string;
}) {
  const [activeId, setActiveId] = useState(categories[0]?._id ?? "");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [isMobileCategoryMenuOpen, setIsMobileCategoryMenuOpen] =
    useState(false);
  const [isMobileSubcategoryMenuOpen, setIsMobileSubcategoryMenuOpen] =
    useState(false);
  const active = categories.find((c) => c._id === activeId) ?? categories[0];

  if (!active) return null;

  const allItemsCount =
    active.items.length +
    active.subcategories.reduce((sum, sub) => sum + sub.items.length, 0);

  const subTabs: SubTab[] = [
    { key: "all", title: "Sve", count: allItemsCount },
    { key: "none", title: "Bez podkategorije", count: active.items.length },
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
    setIsMobileCategoryMenuOpen(false);
    setIsMobileSubcategoryMenuOpen(false);
  };

  const selectSubcategoryFromMenu = (subId: string) => {
    setActiveSubTab(`sub-${subId}`);
    setIsMobileSubcategoryMenuOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-2 z-30 md:hidden">
        <div className="rounded-2xl border border-amber-100/10 bg-[#1b191a]/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 pr-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/70">
                Digitalni meni
              </p>
              <p className="truncate text-[11px] text-amber-100/70">
                {venueName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileCategoryMenuOpen((prev) => !prev);
                setIsMobileSubcategoryMenuOpen(false);
              }}
              className="rounded-xl border border-amber-100/20 bg-amber-200/10 p-2"
              aria-label="Otvori kategorije"
              aria-expanded={isMobileCategoryMenuOpen}
            >
              <HamburgerIcon open={isMobileCategoryMenuOpen} />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-amber-100/10 pt-2">
            <div className="min-w-0 pr-3">
              <p className="truncate text-sm font-semibold text-amber-50">
                {active.title}
              </p>
            </div>
            {hasSubcategories ? (
              <button
                type="button"
                onClick={() => {
                  setIsMobileSubcategoryMenuOpen((prev) => !prev);
                  setIsMobileCategoryMenuOpen(false);
                }}
                className="rounded-xl border border-amber-100/20 bg-amber-200/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-100"
                aria-label="Otvori podkategorije"
                aria-expanded={isMobileSubcategoryMenuOpen}
              >
                Vrste jela
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {(isMobileCategoryMenuOpen || isMobileSubcategoryMenuOpen) && (
        <button
          type="button"
          aria-label="Zatvori mobilni meni"
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
          onClick={() => {
            setIsMobileCategoryMenuOpen(false);
            setIsMobileSubcategoryMenuOpen(false);
          }}
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[82vw] max-w-80 border-l border-amber-100/10 bg-[#120f10] p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          isMobileCategoryMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-100">Kategorije</p>
          <button
            type="button"
            onClick={() => setIsMobileCategoryMenuOpen(false)}
            className="rounded-lg border border-amber-100/20 px-2 py-1 text-xs text-amber-100/80"
          >
            Zatvori
          </button>
        </div>

        <ul className="space-y-2 overflow-y-auto pb-10">
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                type="button"
                onClick={() => selectCategory(cat._id)}
                className={`w-full rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                  cat._id === activeId
                    ? "bg-amber-300/15 text-amber-100"
                    : "bg-white/[0.04] text-amber-50/80"
                }`}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[82vw] max-w-80 border-l border-amber-100/10 bg-[#120f10] p-5 shadow-2xl transition-transform duration-300 md:hidden ${
          isMobileSubcategoryMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-100">Podkategorije</p>
          <button
            type="button"
            onClick={() => setIsMobileSubcategoryMenuOpen(false)}
            className="rounded-lg border border-amber-100/20 px-2 py-1 text-xs text-amber-100/80"
          >
            Zatvori
          </button>
        </div>

        <ul className="space-y-2 overflow-y-auto pb-10">
          <li>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab("all");
                setIsMobileSubcategoryMenuOpen(false);
              }}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                activeSubTab === "all"
                  ? "bg-amber-300/15 text-amber-100"
                  : "bg-white/[0.04] text-amber-50/75"
              }`}
            >
              Sve
            </button>
          </li>

          {active.items.length > 0 && (
            <li>
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab("none");
                  setIsMobileSubcategoryMenuOpen(false);
                }}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeSubTab === "none"
                    ? "bg-amber-300/15 text-amber-100"
                    : "bg-white/[0.04] text-amber-50/75"
                }`}
              >
                Bez podkategorije
              </button>
            </li>
          )}

          {active.subcategories.map((sub) => (
            <li key={sub._id}>
              <button
                type="button"
                onClick={() => selectSubcategoryFromMenu(sub._id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeSubTab === `sub-${sub._id}`
                    ? "bg-amber-300/15 text-amber-100"
                    : "bg-white/[0.04] text-amber-50/75"
                }`}
              >
                <span>{sub.title}</span>
                <span className="text-xs text-amber-50/55">
                  {sub.items.length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

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
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/45">
              Bez podkategorije
            </p>
            <ul className="space-y-3">
              {active.items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </ul>
          </div>
        )}

        {activeSubTab === "none" && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/45">
              Bez podkategorije
            </p>
            {active.items.length === 0 ? (
              <p className="rounded-xl border border-amber-100/10 bg-[#17181b] px-3 py-3 text-sm text-amber-50/65">
                Nema dostupnih artikala.
              </p>
            ) : (
              <ul className="space-y-3">
                {active.items.map((item) => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </ul>
            )}
          </div>
        )}

        {active.subcategories
          .filter(
            (sub) =>
              activeSubTab === "all" || activeSubTab === `sub-${sub._id}`,
          )
          .map((sub) => (
            <div key={sub._id}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/45">
                {sub.title}
              </p>
              {sub.items.length === 0 ? (
                <p className="rounded-xl border border-amber-100/10 bg-[#17181b] px-3 py-3 text-sm text-amber-50/65">
                  Nema dostupnih artikala.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sub.items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </ul>
              )}
            </div>
          ))}

        {allItemsCount === 0 && (
          <p className="rounded-xl border border-amber-100/10 bg-[#17181b] px-3 py-3 text-sm text-amber-50/65">
            Nema dostupnih artikala u ovoj kategoriji.
          </p>
        )}
      </div>
    </div>
  );
}
