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

function ItemCard({ item }: { item: Item }) {
  return (
    <li key={item._id} className="py-3">
      <div className="flex items-start gap-3">
        {item.imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
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
            <h3 className="font-medium">{item.name}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
            )}
          </div>
          <p className="shrink-0 font-semibold">
            {item.price} {item.currency}
          </p>
        </div>
      </div>
    </li>
  );
}

export function MenuTabs({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(categories[0]?._id ?? "");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
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
    setIsMobileSubmenuOpen(false);
  };

  return (
    <div>
      {/* Tab strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => {
              setActiveId(cat._id);
              setActiveSubTab("all");
              setIsMobileSubmenuOpen(false);
            }}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
              cat._id === activeId
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Subcategory tabs for active category */}
      {subTabs.length > 1 && (
        <div className="mt-3 hidden gap-2 overflow-x-auto pb-1 md:flex">
          {subTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectSubTab(tab.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
                tab.key === activeSubTab
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {tab.title}
              <span
                className={`ml-1.5 text-[11px] ${tab.key === activeSubTab ? "text-emerald-100" : "text-emerald-500"}`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Mobile fixed toggle + sidebar for subcategories */}
      {hasSubcategories && (
        <>
          <button
            type="button"
            onClick={() => setIsMobileSubmenuOpen((prev) => !prev)}
            className="fixed bottom-4 right-4 z-40 rounded-full bg-emerald-600 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-lg ring-2 ring-emerald-300/70 md:hidden"
          >
            Podkategorije
          </button>

          {isMobileSubmenuOpen && (
            <button
              type="button"
              aria-label="Zatvori podkategorije"
              className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
              onClick={() => setIsMobileSubmenuOpen(false)}
            />
          )}

          <aside
            className={`fixed right-0 top-0 z-50 h-full w-72 bg-white p-4 shadow-2xl transition-transform duration-300 md:hidden ${
              isMobileSubmenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                Podkategorije
              </h3>
              <button
                type="button"
                onClick={() => setIsMobileSubmenuOpen(false)}
                className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
              >
                Zatvori
              </button>
            </div>
            <ul className="space-y-2 overflow-y-auto pb-20">
              {subTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    type="button"
                    onClick={() => selectSubTab(tab.key)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                      tab.key === activeSubTab
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <span>{tab.title}</span>
                    <span className="text-xs">{tab.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </>
      )}

      {/* Items for active tab */}
      <div className="mt-5 space-y-5">
        {activeSubTab === "all" && active.items.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bez podkategorije
            </p>
            <ul className="divide-y divide-slate-200">
              {active.items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </ul>
          </div>
        )}

        {activeSubTab === "none" && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bez podkategorije
            </p>
            {active.items.length === 0 ? (
              <p className="text-sm text-slate-500">Nema dostupnih artikala.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {sub.title}
              </p>
              {sub.items.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nema dostupnih artikala.
                </p>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {sub.items.map((item) => (
                    <ItemCard key={item._id} item={item} />
                  ))}
                </ul>
              )}
            </div>
          ))}

        {allItemsCount === 0 && (
          <p className="text-sm text-slate-500">
            Nema dostupnih artikala u ovoj kategoriji.
          </p>
        )}
      </div>
    </div>
  );
}
