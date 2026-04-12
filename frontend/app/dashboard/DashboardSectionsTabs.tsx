"use client";

import { useState } from "react";

import { DashboardItemTabs } from "./DashboardItemTabs";
import { FormActionButton } from "./FormActionButton";

type Category = {
  _id: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
};

type Subcategory = {
  _id: string;
  title: string;
  titleEn?: string;
  sortOrder: number;
  categoryId: string;
};

type MenuItem = {
  _id: string;
  name: string;
  nameEn?: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  categoryTitle: string;
  description?: string;
  descriptionEn?: string;
  categoryId: string;
  sortOrder: number;
  imageUrl?: string;
  subCategoryId?: string;
  subCategoryTitle?: string;
};

type Props = {
  categories: Category[];
  subcategories: Subcategory[];
  menuItems: MenuItem[];
  createCategoryAction: (formData: FormData) => Promise<void>;
  createMenuItemAction: (formData: FormData) => Promise<void>;
  updateCategoryAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  updateMenuItemAction: (formData: FormData) => Promise<void>;
  deleteMenuItemAction: (formData: FormData) => Promise<void>;
  createSubcategoryAction: (formData: FormData) => Promise<void>;
  updateSubcategoryAction: (formData: FormData) => Promise<void>;
  deleteSubcategoryAction: (formData: FormData) => Promise<void>;
};

type DashboardTab =
  | "add-item"
  | "add-category"
  | "categories"
  | "items-by-category";

const DASHBOARD_TABS: { id: DashboardTab; label: string }[] = [
  { id: "add-item", label: "Dodaj artikl" },
  { id: "add-category", label: "Dodaj kategoriju" },
  { id: "categories", label: "Kategorije" },
  { id: "items-by-category", label: "Artikli po kategorijama" },
];

export function DashboardSectionsTabs({
  categories,
  subcategories,
  menuItems,
  createCategoryAction,
  createMenuItemAction,
  updateCategoryAction,
  deleteCategoryAction,
  updateMenuItemAction,
  deleteMenuItemAction,
  createSubcategoryAction,
  updateSubcategoryAction,
  deleteSubcategoryAction,
}: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("add-item");

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab.id === activeTab
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "add-item" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Dodaj artikl</h2>
          <form
            action={createMenuItemAction}
            className="mt-4 flex flex-col gap-3"
            encType="multipart/form-data"
          >
            <input
              name="name"
              required
              placeholder="Naziv artikla (HR)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              name="nameEn"
              placeholder="Naziv artikla (EN)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <textarea
              name="description"
              placeholder="Opis (HR)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <textarea
              name="descriptionEn"
              placeholder="Opis (EN)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              name="currency"
              defaultValue="EUR"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <select
              name="categoryId"
              required
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Odaberi kategoriju</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <select
              name="subCategoryId"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Bez podkategorije</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {categories.find((c) => c._id === sub.categoryId)?.title} /{" "}
                  {sub.title}
                </option>
              ))}
            </select>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <div>
              <label className="mb-1 block text-sm text-slate-600">
                Slika artikla (opcijski)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <FormActionButton
              idleLabel="Spremi artikl"
              loadingLabel="Spremam artikl..."
              disabled={categories.length === 0}
              className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </form>
          {categories.length === 0 && (
            <p className="mt-3 text-sm text-amber-700">
              Prvo kreiraj barem jednu kategoriju.
            </p>
          )}
        </div>
      )}

      {activeTab === "add-category" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Dodaj kategoriju
          </h2>
          <form
            action={createCategoryAction}
            className="mt-4 flex flex-col gap-3"
          >
            <input
              name="title"
              required
              placeholder="Naziv (HR)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              name="titleEn"
              placeholder="Naziv (EN)"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <FormActionButton
              idleLabel="Spremi kategoriju"
              loadingLabel="Spremam..."
              className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </form>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Kategorije</h2>
          <ul className="mt-4 space-y-3">
            {categories.map((category) => (
              <li
                key={category._id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
              >
                <form action={updateCategoryAction} className="grid gap-2">
                  <input type="hidden" name="categoryId" value={category._id} />
                  <div className="text-xs text-slate-600">Uredi kategoriju</div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_1fr_110px_auto_auto]">
                    <input
                      name="title"
                      defaultValue={category.title}
                      required
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      name="titleEn"
                      defaultValue={category.titleEn}
                      placeholder="EN"
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      name="sortOrder"
                      type="number"
                      defaultValue={category.sortOrder}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <FormActionButton
                      idleLabel="Spremi"
                      loadingLabel="Spremam..."
                      className="rounded bg-blue-500 px-3 py-2 text-xs text-white transition hover:bg-blue-600 disabled:opacity-70"
                    />
                    <FormActionButton
                      idleLabel="Obriši"
                      loadingLabel="Brisem..."
                      formAction={deleteCategoryAction}
                      className="rounded bg-red-500 px-3 py-2 text-xs text-white transition hover:bg-red-600 disabled:opacity-70"
                    />
                  </div>
                </form>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="text-sm text-slate-500">Nema kategorija jos.</li>
            )}
          </ul>
        </div>
      )}

      {activeTab === "items-by-category" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Artikli po kategorijama
          </h2>
          <DashboardItemTabs
            categories={categories}
            subcategories={subcategories}
            menuItems={menuItems}
            updateItemAction={updateMenuItemAction}
            deleteItemAction={deleteMenuItemAction}
            createSubcategoryAction={createSubcategoryAction}
            updateSubcategoryAction={updateSubcategoryAction}
            deleteSubcategoryAction={deleteSubcategoryAction}
          />
        </div>
      )}
    </section>
  );
}
