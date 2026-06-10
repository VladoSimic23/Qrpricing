"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PlusCircle,
  FolderPlus,
  Folder,
  List,
  Settings,
  ChevronDown,
} from "lucide-react";

import { DashboardItemTabs } from "./DashboardItemTabs";
import { FormActionButton } from "./FormActionButton";
import { ToastForm } from "./ToastForm";

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
  currency: "EUR" | "BAM";
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
  tenantName: string;
  tenantExchangeRate: number;
  tenantLogo?: string;
  hideDigitalMenuHeader?: boolean;
  showPricesBam: boolean;
  showPricesEur: boolean;
  activeLanguages: string[];
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
  allowWaiterCall: boolean;
  telegramChatId?: string;
  telegramThreadId?: number;
  categories: Category[];
  subcategories: Subcategory[];
  menuItems: MenuItem[];
  updateExchangeRateAction: (formData: FormData) => Promise<void>;
  updateTenantLogoAction: (formData: FormData) => Promise<void>;
  updateSocialLinksAction: (formData: FormData) => Promise<void>;
  updateWaiterCallSettingsAction: (formData: FormData) => Promise<void>;
  updateTenantNameAction: (formData: FormData) => Promise<void>;
  deleteTenantAction: () => Promise<void>;
  createCategoryAction: (formData: FormData) => Promise<void>;
  createMenuItemAction: (formData: FormData) => Promise<void>;
  updateCategoryAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  updateMenuItemAction: (formData: FormData) => Promise<void>;
  deleteMenuItemAction: (formData: FormData) => Promise<void>;
  createSubcategoryAction: (formData: FormData) => Promise<void>;
  updateSubcategoryAction: (formData: FormData) => Promise<void>;
  deleteSubcategoryAction: (formData: FormData) => Promise<void>;
  reorderAction: (
    type: "menuCategory" | "menuSubcategory" | "menuItem",
    orderedIds: string[],
  ) => Promise<void>;
};

type DashboardTab =
  | "add-item"
  | "add-category"
  | "categories"
  | "items-by-category"
  | "settings";

const DASHBOARD_TABS: {
  id: DashboardTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "add-item", label: "Dodaj artikl", icon: PlusCircle },
  { id: "add-category", label: "Dodaj kategoriju", icon: FolderPlus },
  { id: "categories", label: "Kategorije", icon: Folder },
  { id: "items-by-category", label: "Artikli po kategorijama", icon: List },
  { id: "settings", label: "Postavke", icon: Settings },
];

function SortableCategoryItem({
  category,
  updateCategoryAction,
  deleteCategoryAction,
  activeLanguages,
}: {
  category: Category;
  updateCategoryAction: (formData: FormData) => Promise<void>;
  deleteCategoryAction: (formData: FormData) => Promise<void>;
  activeLanguages: string[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const isHrActive = activeLanguages.includes("hr");
  const isEnActive = activeLanguages.includes("en");

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 ${isDragging ? "shadow-md" : ""}`}
    >
      <ToastForm
        action={updateCategoryAction}
        successMessage="Kategorija je uspješno ažurirana!"
        deleteAction={deleteCategoryAction}
        deleteSuccessMessage="Kategorija je uspješno obrisana!"
        deleteConfirmMessage="Jeste li sigurni da želite obrisati ovu kategoriju? Svi artikli i podkategorije unutar nje bit će obrisani."
        className="grid gap-2"
      >
        <input type="hidden" name="categoryId" value={category._id} />
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span
              {...attributes}
              {...listeners}
              className="cursor-move p-1 hover:bg-slate-200 rounded touch-none"
              title="Povuci za promjenu redoslijeda"
            >
              ☰
            </span>
            <span>Uredi kategoriju</span>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto]">
          {isHrActive && (
            <input
              name="title"
              defaultValue={category.title}
              required
              className="rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="HR"
            />
          )}
          {isEnActive && (
            <input
              name="titleEn"
              defaultValue={category.titleEn}
              placeholder="EN"
              className="rounded border border-slate-300 px-3 py-2 text-sm"
            />
          )}
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
    </li>
  );
}

export function DashboardSectionsTabs({
  tenantName,
  tenantExchangeRate,
  tenantLogo,
  hideDigitalMenuHeader,
  showPricesBam,
  showPricesEur,
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  websiteUrl,
  allowWaiterCall,
  telegramChatId,
  telegramThreadId,
  categories,
  subcategories,
  menuItems,
  updateExchangeRateAction,
  updateTenantLogoAction,
  updateSocialLinksAction,
  updateWaiterCallSettingsAction,
  updateTenantNameAction,
  deleteTenantAction,
  createCategoryAction,
  createMenuItemAction,
  updateCategoryAction,
  deleteCategoryAction,
  updateMenuItemAction,
  deleteMenuItemAction,
  createSubcategoryAction,
  updateSubcategoryAction,
  deleteSubcategoryAction,
  reorderAction,
  activeLanguages,
}: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("add-item");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);

  const isHrActive = activeLanguages?.includes("hr") ?? true;
  const isEnActive = activeLanguages?.includes("en") ?? true;

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const isExchangeRateSet = tenantExchangeRate && tenantExchangeRate > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEndCategories = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = localCategories.findIndex((c) => c._id === active.id);
      const newIndex = localCategories.findIndex((c) => c._id === over.id);
      const newCategories = arrayMove(localCategories, oldIndex, newIndex);
      setLocalCategories(newCategories);
      await reorderAction(
        "menuCategory",
        newCategories.map((c) => c._id),
      );
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {!isExchangeRateSet && (
        <div className="mb-6 rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-900">
            ⚠️ Obavezno: Postavi tečaj valuta
          </h3>
          <p className="mt-2 text-sm text-amber-800">
            Prije nego što počneš dodavati artikle, postavi tečaj EUR → KM u{" "}
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className="font-semibold underline"
            >
              Postavkama
            </button>
            .
          </p>
        </div>
      )}

      {/* Main Layout matches the Sidebar approach */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Dropdown Trigger */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 shadow-sm"
          >
            <span className="flex items-center gap-2">
              {(() => {
                const activeTabObj = DASHBOARD_TABS.find(
                  (t) => t.id === activeTab,
                );
                const ActiveIcon = activeTabObj?.icon || Settings;
                return (
                  <>
                    <ActiveIcon size={18} className="text-emerald-600" />
                    {activeTabObj?.label}
                  </>
                );
              })()}
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform ${isMobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Sidebar Nav */}
        <div
          className={`md:w-64 md:shrink-0 flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 h-fit ${
            isMobileMenuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {DASHBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition text-left ${
                  tab.id === activeTab
                    ? "bg-white text-slate-900 shadow border border-slate-200"
                    : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    tab.id === activeTab ? "text-emerald-600" : "text-slate-400"
                  }
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {activeTab === "add-item" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Dodaj artikl
              </h2>
              <ToastForm
                action={createMenuItemAction}
                successMessage="Artikal je uspješno dodan!"
                className="mt-4 flex flex-col gap-3"
                encType="multipart/form-data"
                resetOnSuccess
              >
                {isHrActive && (
                  <input
                    name="name"
                    required
                    placeholder="Naziv artikla (HR)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                {isEnActive && (
                  <input
                    name="nameEn"
                    placeholder="Naziv artikla (EN)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                {isHrActive && (
                  <textarea
                    name="description"
                    placeholder="Opis (HR)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                {isEnActive && (
                  <textarea
                    name="descriptionEn"
                    placeholder="Opis (EN)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <select
                  name="currency"
                  defaultValue="BAM"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="EUR">EUR</option>
                  <option value="BAM">KM</option>
                </select>
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
                      {categories.find((c) => c._id === sub.categoryId)?.title}{" "}
                      / {sub.title}
                    </option>
                  ))}
                </select>
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
                  disabled={categories.length === 0 || !isExchangeRateSet}
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </ToastForm>
              {categories.length === 0 && (
                <p className="mt-3 text-sm text-amber-700">
                  Prvo kreiraj barem jednu kategoriju.
                </p>
              )}
              {isExchangeRateSet === false && (
                <p className="mt-3 text-sm text-amber-700">
                  Postavi tečaj valuta u{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("settings")}
                    className="font-semibold underline"
                  >
                    Postavkama
                  </button>{" "}
                  prije nego što možeš dodati artikle.
                </p>
              )}
            </div>
          )}

          {activeTab === "add-category" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Dodaj kategoriju
              </h2>
              <ToastForm
                action={createCategoryAction}
                successMessage="Kategorija je uspješno dodana!"
                className="mt-4 flex flex-col gap-3"
                resetOnSuccess
              >
                {isHrActive && (
                  <input
                    name="title"
                    required
                    placeholder="Naziv (HR)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                {isEnActive && (
                  <input
                    name="titleEn"
                    placeholder="Naziv (EN)"
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
                <FormActionButton
                  idleLabel="Spremi kategoriju"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Kategorije
              </h2>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndCategories}
              >
                <SortableContext
                  items={localCategories.map((c) => c._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="mt-4 space-y-3">
                    {localCategories.map((category) => (
                      <SortableCategoryItem
                        key={category._id}
                        category={category}
                        updateCategoryAction={updateCategoryAction}
                        deleteCategoryAction={deleteCategoryAction}
                        activeLanguages={activeLanguages}
                      />
                    ))}
                    {localCategories.length === 0 && (
                      <li className="text-sm text-slate-500">
                        Nema kategorija jos.
                      </li>
                    )}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === "items-by-category" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Artikli po kategorijama
              </h2>
              <DashboardItemTabs
                tenantExchangeRate={tenantExchangeRate}
                categories={categories}
                subcategories={subcategories}
                menuItems={menuItems}
                updateItemAction={updateMenuItemAction}
                deleteItemAction={deleteMenuItemAction}
                createSubcategoryAction={createSubcategoryAction}
                updateSubcategoryAction={updateSubcategoryAction}
                deleteSubcategoryAction={deleteSubcategoryAction}
                reorderAction={reorderAction}
                activeLanguages={activeLanguages}
              />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-900">Postavke</h2>

              <ToastForm
                action={updateExchangeRateAction}
                successMessage="Tečaj je uspješno ažuriran!"
                className="mt-4 flex flex-col gap-3"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Tečaj EUR → KM
                  </label>
                  <input
                    name="exchangeRateEurToBam"
                    type="number"
                    step="0.00001"
                    min="0.00001"
                    required
                    defaultValue={
                      tenantExchangeRate > 0 ? tenantExchangeRate : 1.95
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-slate-600">
                    Unesi trenutni tečaj da se cijene pravilno prikazuju u KM i
                    EUR.
                  </p>
                </div>
                <FormActionButton
                  idleLabel="Spremi tečaj"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>

              <ToastForm
                action={updateTenantNameAction}
                successMessage="Naziv restorana je uspješno ažuriran!"
                className="mt-4 flex flex-col gap-3"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Naziv restorana
                  </label>
                  <input
                    name="name"
                    required
                    defaultValue={tenantName}
                    placeholder="Naziv restorana"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-slate-600">
                    Ovaj naziv će se prikazivati na javnoj menu stranici.
                  </p>
                </div>

                <FormActionButton
                  idleLabel="Spremi naziv"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>

              <ToastForm
                action={updateTenantLogoAction}
                successMessage="Postavke su uspješno ažurirane!"
                className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6"
                encType="multipart/form-data"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Logo restorana
                  </label>
                  <p className="text-xs text-slate-600">
                    Ovdje učitaj logo koji će se prikazati umjesto naziva
                    restorana u meniju.
                  </p>
                  {tenantLogo && (
                    <div className="mt-2">
                      <p className="mb-2 text-xs text-slate-600">
                        Trenutni logo:
                      </p>
                      <Image
                        src={tenantLogo}
                        alt="Trenutni logo"
                        width={200}
                        height={64}
                        className="h-16 w-auto rounded border border-slate-200 object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                  <p className="text-xs text-slate-500">
                    Preporučena veličina: 200x100px, max 5MB
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="hideDigitalMenuHeader"
                      defaultChecked={hideDigitalMenuHeader}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">
                      Sakrij naslov &quot;Digitalni Meni&quot;
                    </span>
                  </label>
                  <p className="text-xs text-slate-600">
                    Ako je uključeno, naslov &quot;Digitalni Meni&quot; se neće
                    prikazati u meniju.
                  </p>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="showPricesBam"
                      defaultChecked={showPricesBam}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">
                      Prikazuj cijene u KM
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="showPricesEur"
                      defaultChecked={showPricesEur}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">
                      Prikazuj cijene u EUR
                    </span>
                  </label>

                  <p className="text-xs text-slate-600">
                    Default je uključeno za obje valute.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Aktivni jezici
                  </h4>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="activeLanguagesHr"
                      defaultChecked={activeLanguages.includes("hr")}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">Hrvatski</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="activeLanguagesEn"
                      defaultChecked={activeLanguages.includes("en")}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">Engleski</span>
                  </label>
                  <p className="text-xs text-slate-600">
                    Neaktivni jezici će biti izbačeni sa cjenika.
                  </p>
                </div>

                <FormActionButton
                  idleLabel="Spremi postavke"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>

              <ToastForm
                action={updateSocialLinksAction}
                successMessage="Društvene mreže su uspješno ažurirane!"
                className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Društvene mreže i linkovi
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">
                    Dodajte linkove na vaše društvene mreže koji će se
                    prikazivati u podnožju (footeru) vašeg menija. Sva polja su
                    opcionalna.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Instagram URL
                    </label>
                    <input
                      name="instagramUrl"
                      type="url"
                      defaultValue={instagramUrl}
                      placeholder="https://instagram.com/vas-profil"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Facebook URL
                    </label>
                    <input
                      name="facebookUrl"
                      type="url"
                      defaultValue={facebookUrl}
                      placeholder="https://facebook.com/vas-profil"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      TikTok URL
                    </label>
                    <input
                      name="tiktokUrl"
                      type="url"
                      defaultValue={tiktokUrl}
                      placeholder="https://tiktok.com/@vas-profil"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Web stranica URL
                    </label>
                    <input
                      name="websiteUrl"
                      type="url"
                      defaultValue={websiteUrl}
                      placeholder="https://vasa-stranica.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <FormActionButton
                  idleLabel="Spremi društvene mreže"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>

              <ToastForm
                action={updateWaiterCallSettingsAction}
                successMessage="Telegram postavke za poziv konobara su spremljene!"
                className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Pozovi konobara (Telegram)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Aktiviraj dugme u meniju koje šalje Telegram poruku osoblju.
                    Za slanje mora biti postavljena server varijabla
                    TELEGRAM_BOT_TOKEN.
                  </p>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="allowWaiterCall"
                      defaultChecked={allowWaiterCall}
                      className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                    />
                    <span className="text-sm text-slate-700">
                      Omogući opciju &quot;Pozovi konobara&quot;
                    </span>
                  </label>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Telegram Chat ID
                    </label>
                    <input
                      name="telegramChatId"
                      defaultValue={telegramChatId}
                      placeholder="npr. -1001234567890"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Telegram Topic Thread ID (opcionalno)
                    </label>
                    <input
                      name="telegramThreadId"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={telegramThreadId}
                      placeholder="npr. 12"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <FormActionButton
                  idleLabel="Spremi Telegram postavke"
                  loadingLabel="Spremam..."
                  className="w-fit rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </ToastForm>

              <div className="mt-12 rounded-xl border border-red-200 bg-red-50 p-6">
                <h3 className="text-lg font-semibold text-red-700">
                  Opasna zona (Danger zone)
                </h3>
                <p className="mt-2 text-sm text-red-600">
                  Ova akcija je nepovratna. Brisanje restorana i menija
                  izbrisati će sve podatke zauvijek iz baze podataka i vaš
                  cjenik više neće biti dostupan.
                </p>
                <form
                  action={async () => {
                    if (
                      window.confirm(
                        "Jeste li sigurni da želite obrisati cjenik i cijeli restoran? Ova akcija je nepovratna i izbrisat će sve vaše podatke zauvijek!",
                      )
                    ) {
                      await deleteTenantAction();
                    }
                  }}
                >
                  <FormActionButton
                    idleLabel="Obriši cjenik i restoran"
                    loadingLabel="Brišem..."
                    className="mt-4 w-fit rounded-full bg-red-600 px-6 py-2 text-white font-medium transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
