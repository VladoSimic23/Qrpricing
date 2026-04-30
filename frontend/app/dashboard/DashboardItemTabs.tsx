"use client";

import { useState } from "react";
import { FormActionButton } from "./FormActionButton";
import { ToastForm } from "./ToastForm";
import { formatPricePair } from "@/lib/pricing";

type Category = { _id: string; title: string; sortOrder: number };
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
  currency: "EUR" | "BAM";
  isAvailable: boolean;
  categoryTitle: string;
  description?: string;
  descriptionEn?: string;
  categoryId: string;
  subCategoryId?: string;
  subCategoryTitle?: string;
  sortOrder: number;
  imageUrl?: string;
};
type Props = {
  tenantExchangeRate: number;
  categories: Category[];
  subcategories: Subcategory[];
  menuItems: MenuItem[];
  updateItemAction: (formData: FormData) => Promise<void>;
  deleteItemAction: (formData: FormData) => Promise<void>;
  createSubcategoryAction: (formData: FormData) => Promise<void>;
  updateSubcategoryAction: (formData: FormData) => Promise<void>;
  deleteSubcategoryAction: (formData: FormData) => Promise<void>;
};

function ItemForm({
  item,
  categories,
  subcategories,
  updateItemAction,
  deleteItemAction,
  tenantExchangeRate,
}: {
  item: MenuItem;
  categories: Category[];
  subcategories: Subcategory[];
  updateItemAction: (formData: FormData) => Promise<void>;
  deleteItemAction: (formData: FormData) => Promise<void>;
  tenantExchangeRate: number;
}) {
  const catSubs = subcategories.filter((s) => s.categoryId === item.categoryId);
  return (
    <ToastForm
      action={updateItemAction}
      successMessage="Artikal je uspješno ažuriran!"
      deleteAction={deleteItemAction}
      deleteSuccessMessage="Artikal je uspješno obrisan!"
      className="grid gap-2"
      encType="multipart/form-data"
    >
      <input type="hidden" name="itemId" value={item._id} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{item.name}</span>
        <span className="whitespace-nowrap text-xs text-slate-500">
          {formatPricePair(item.price, item.currency, tenantExchangeRate)}
        </span>
      </div>
      {item.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-20 w-20 rounded object-cover"
        />
      )}
      <input
        name="name"
        required
        defaultValue={item.name}
        placeholder="Naziv (HR)"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <input
        name="nameEn"
        defaultValue={item.nameEn}
        placeholder="Naziv (EN)"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <textarea
        name="description"
        defaultValue={item.description}
        placeholder="Opis (HR)"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <textarea
        name="descriptionEn"
        defaultValue={item.descriptionEn}
        placeholder="Opis (EN)"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={item.price}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
        <select
          name="currency"
          defaultValue={item.currency}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="EUR">EUR</option>
          <option value="BAM">KM</option>
        </select>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select
          name="categoryId"
          required
          defaultValue={item.categoryId}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
        <select
          name="subCategoryId"
          defaultValue={item.subCategoryId ?? ""}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">— Bez podkategorije —</option>
          {catSubs.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.title}
            </option>
          ))}
        </select>
        <input
          name="sortOrder"
          type="number"
          defaultValue={item.sortOrder}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          name="isAvailable"
          defaultValue={item.isAvailable ? "true" : "false"}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="true">Dostupno</option>
          <option value="false">Nedostupno</option>
        </select>
        <div>
          <label className="text-xs text-slate-600">
            Nova slika (opcijski)
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <FormActionButton
          idleLabel="Spremi"
          loadingLabel="Spremam..."
          className="rounded bg-blue-500 px-3 py-2 text-xs text-white transition hover:bg-blue-600 disabled:opacity-70"
        />
        <FormActionButton
          idleLabel="Obriši"
          loadingLabel="Brisem..."
          data-toast-action="delete"
          className="rounded bg-red-500 px-3 py-2 text-xs text-white transition hover:bg-red-600 disabled:opacity-70"
        />
      </div>
    </ToastForm>
  );
}

export function DashboardItemTabs({
  tenantExchangeRate,
  categories,
  subcategories,
  menuItems,
  updateItemAction,
  deleteItemAction,
  createSubcategoryAction,
  updateSubcategoryAction,
  deleteSubcategoryAction,
}: Props) {
  const [activeId, setActiveId] = useState(categories[0]?._id ?? "");
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const activeCategory = categories.find((c) => c._id === activeId);
  const activeSubs = subcategories.filter((s) => s.categoryId === activeId);
  const activeItems = menuItems.filter((item) => item.categoryId === activeId);
  const noSubItems = activeItems.filter((item) => !item.subCategoryId);

  const renderAccordionItem = (item: MenuItem) => {
    const isOpen = expandedItemId === item._id;

    return (
      <li
        key={item._id}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm"
      >
        <button
          type="button"
          onClick={() =>
            setExpandedItemId((prev) => (prev === item._id ? null : item._id))
          }
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div>
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">
              {formatPricePair(item.price, item.currency, tenantExchangeRate)} ·{" "}
              {item.isAvailable ? "Dostupno" : "Nedostupno"}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {isOpen ? "Sakrij detalje" : "Prikazi detalje"}
          </span>
        </button>

        {isOpen && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <ItemForm
              item={item}
              categories={categories}
              subcategories={subcategories}
              updateItemAction={updateItemAction}
              deleteItemAction={deleteItemAction}
              tenantExchangeRate={tenantExchangeRate}
            />
          </div>
        )}
      </li>
    );
  };

  if (categories.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">Nema kategorija jos.</p>;
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
        {categories.map((cat) => {
          const count = menuItems.filter(
            (i) => i.categoryId === cat._id,
          ).length;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => setActiveId(cat._id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cat._id === activeId
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat.title}
              <span
                className={`ml-1.5 text-xs ${cat._id === activeId ? "text-slate-300" : "text-slate-400"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeCategory && (
        <div className="mt-4">
          {/* Subcategory management panel */}
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Podkategorije — {activeCategory.title}
            </p>
            {/* Add subcategory form */}
            <ToastForm
              action={createSubcategoryAction}
              successMessage="Podkategorija je uspješno dodana!"
              className="mb-3 flex flex-wrap items-end gap-2"
            >
              <input type="hidden" name="categoryId" value={activeId} />
              <input
                name="title"
                required
                placeholder="Naziv podkategorije"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <input
                name="titleEn"
                placeholder="Naziv podkategorije (EN)"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <input
                name="sortOrder"
                type="number"
                placeholder="Redoslijed"
                className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <FormActionButton
                idleLabel="+ Dodaj"
                loadingLabel="Dodajem..."
                className="rounded bg-emerald-500 px-3 py-2 text-sm text-white transition hover:bg-emerald-600 disabled:opacity-70"
              />
            </ToastForm>
            {/* Existing subcategories */
            {activeSubs.length > 0 && (
              <ul className="space-y-2">
                {activeSubs.map((sub) => (
                  <li
                    key={sub._id}
                    className="rounded-lg border border-slate-200 bg-white p-2"
                  >
                    <ToastForm
                      action={updateSubcategoryAction}
                      successMessage="Podkategorija je uspješno ažurirana!"
                      deleteAction={deleteSubcategoryAction}
                      deleteSuccessMessage="Podkategorija je uspješno obrisana!"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <input
                        type="hidden"
                        name="subCategoryId"
                        value={sub._id}
                      />
                      <input
                        name="title"
                        required
                        defaultValue={sub.title}
                        className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                      <input
                        name="titleEn"
                        defaultValue={sub.titleEn}
                        placeholder="EN"
                        className="rounded border border-slate-300 px-2 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={sub.sortOrder}
                        className="w-20 rounded border border-slate-300 px-2 py-1 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                      <FormActionButton
                        idleLabel="Spremi"
                        loadingLabel="Spremam..."
                        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600 disabled:opacity-70"
                      />
                      <FormActionButton
                        idleLabel="Obriši"
                        loadingLabel="Brisem..."
                        data-toast-action="delete"
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-70"
                      />
                    </ToastForm>
                  </li>
                ))}
              </ul>
            )}
            {activeSubs.length === 0 && (
              <p className="text-xs text-slate-400">
                Nema podkategorija u ovoj kategoriji.
              </p>
            )}
          </div>

          {/* Items without subcategory */}
          {noSubItems.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Bez podkategorije
              </p>
              <ul className="space-y-4">
                {noSubItems.map((item) => renderAccordionItem(item))}
              </ul>
            </div>
          )}

          {/* Items grouped by subcategory */}
          {activeSubs.map((sub) => {
            const subItems = activeItems.filter(
              (i) => i.subCategoryId === sub._id,
            );
            return (
              <div key={sub._id} className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {sub.title}
                </p>
                {subItems.length === 0 ? (
                  <p className="text-xs text-slate-400">Nema artikala.</p>
                ) : (
                  <ul className="space-y-4">
                    {subItems.map((item) => renderAccordionItem(item))}
                  </ul>
                )}
              </div>
            );
          })}

          {activeItems.length === 0 && (
            <p className="text-sm text-slate-400">
              Nema artikala u ovoj kategoriji.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
