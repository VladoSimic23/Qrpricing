"use client";

import { useState } from "react";

type Category = { _id: string; title: string; sortOrder: number };
type Subcategory = {
  _id: string;
  title: string;
  sortOrder: number;
  categoryId: string;
};
type MenuItem = {
  _id: string;
  name: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  categoryTitle: string;
  description?: string;
  categoryId: string;
  subCategoryId?: string;
  subCategoryTitle?: string;
  sortOrder: number;
  imageUrl?: string;
};
type Props = {
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
}: {
  item: MenuItem;
  categories: Category[];
  subcategories: Subcategory[];
  updateItemAction: (formData: FormData) => Promise<void>;
  deleteItemAction: (formData: FormData) => Promise<void>;
}) {
  const catSubs = subcategories.filter((s) => s.categoryId === item.categoryId);
  return (
    <form
      action={updateItemAction}
      className="grid gap-2"
      encType="multipart/form-data"
    >
      <input type="hidden" name="itemId" value={item._id} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{item.name}</span>
        <span className="whitespace-nowrap text-xs text-slate-500">
          {item.price} {item.currency}
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
        className="rounded border border-slate-300 px-3 py-2"
      />
      <textarea
        name="description"
        defaultValue={item.description}
        className="rounded border border-slate-300 px-3 py-2"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={item.price}
          className="rounded border border-slate-300 px-3 py-2"
        />
        <input
          name="currency"
          defaultValue={item.currency}
          className="rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select
          name="categoryId"
          required
          defaultValue={item.categoryId}
          className="rounded border border-slate-300 px-3 py-2"
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
          className="rounded border border-slate-300 px-3 py-2"
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
          className="rounded border border-slate-300 px-3 py-2"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          name="isAvailable"
          defaultValue={item.isAvailable ? "true" : "false"}
          className="rounded border border-slate-300 px-3 py-2"
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
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-500 px-3 py-2 text-xs text-white transition hover:bg-blue-600"
        >
          Spremi
        </button>
        <button
          formAction={deleteItemAction}
          className="rounded bg-red-500 px-3 py-2 text-xs text-white transition hover:bg-red-600"
        >
          Obriši
        </button>
      </div>
    </form>
  );
}

export function DashboardItemTabs({
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

  const activeCategory = categories.find((c) => c._id === activeId);
  const activeSubs = subcategories.filter((s) => s.categoryId === activeId);
  const activeItems = menuItems.filter((item) => item.categoryId === activeId);
  const noSubItems = activeItems.filter((item) => !item.subCategoryId);

  if (categories.length === 0) {
    return <p className="mt-4 text-sm text-slate-500">Nema kategorija jos.</p>;
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
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
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
          <div className="mb-4 rounded-lg border-2 border-dashed border-slate-300 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Podkategorije — {activeCategory.title}
            </p>
            {/* Add subcategory form */}
            <form
              action={createSubcategoryAction}
              className="mb-3 flex flex-wrap items-end gap-2"
            >
              <input type="hidden" name="categoryId" value={activeId} />
              <input
                name="title"
                required
                placeholder="Naziv podkategorije"
                className="rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                name="sortOrder"
                type="number"
                placeholder="Redoslijed"
                className="w-24 rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="rounded bg-emerald-500 px-3 py-2 text-sm text-white transition hover:bg-emerald-600"
              >
                + Dodaj
              </button>
            </form>
            {/* Existing subcategories */}
            {activeSubs.length > 0 && (
              <ul className="space-y-2">
                {activeSubs.map((sub) => (
                  <li key={sub._id} className="rounded bg-slate-50 p-2">
                    <form
                      action={updateSubcategoryAction}
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
                        className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                      />
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={sub.sortOrder}
                        className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                      />
                      <button
                        type="submit"
                        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                      >
                        Spremi
                      </button>
                      <button
                        formAction={deleteSubcategoryAction}
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Obriši
                      </button>
                    </form>
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
                {noSubItems.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-lg bg-slate-100 px-3 py-3 text-sm"
                  >
                    <ItemForm
                      item={item}
                      categories={categories}
                      subcategories={subcategories}
                      updateItemAction={updateItemAction}
                      deleteItemAction={deleteItemAction}
                    />
                  </li>
                ))}
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
                    {subItems.map((item) => (
                      <li
                        key={item._id}
                        className="rounded-lg bg-slate-100 px-3 py-3 text-sm"
                      >
                        <ItemForm
                          item={item}
                          categories={categories}
                          subcategories={subcategories}
                          updateItemAction={updateItemAction}
                          deleteItemAction={deleteItemAction}
                        />
                      </li>
                    ))}
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
