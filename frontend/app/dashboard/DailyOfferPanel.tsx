"use client";

import { FormActionButton } from "./FormActionButton";
import { SizeVariantsEditor } from "./SizeVariantsEditor";
import { ToastForm } from "./ToastForm";

type DailyOfferItem = {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  currency: "EUR" | "BAM";
  sizeVariants?: { label: string; price: number }[];
  isAvailable: boolean;
  imageUrl?: string;
};

type Props = {
  items: DailyOfferItem[];
  showPricesBam: boolean;
  showPricesEur: boolean;
  activeLanguages: string[];
  createAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

const inputClass =
  "rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

function DailyOfferFields({
  item,
  showPricesBam,
  showPricesEur,
  activeLanguages,
}: {
  item?: DailyOfferItem;
  showPricesBam: boolean;
  showPricesEur: boolean;
  activeLanguages: string[];
}) {
  const isHrActive = activeLanguages.includes("hr");
  const isEnActive = activeLanguages.includes("en");

  return (
    <>
      {isHrActive && (
        <input
          name="name"
          required
          defaultValue={item?.name}
          placeholder="Naziv artikla (HR)"
          className={inputClass}
        />
      )}
      {isEnActive && (
        <input
          name="nameEn"
          defaultValue={item?.nameEn}
          placeholder="Naziv artikla (EN)"
          className={inputClass}
        />
      )}
      {isHrActive && (
        <textarea
          name="description"
          defaultValue={item?.description}
          placeholder="Opis (HR)"
          className={inputClass}
        />
      )}
      {isEnActive && (
        <textarea
          name="descriptionEn"
          defaultValue={item?.descriptionEn}
          placeholder="Opis (EN)"
          className={inputClass}
        />
      )}
      <SizeVariantsEditor
        defaultPrice={item?.price}
        defaultCurrency={item?.currency}
        defaultVariants={item?.sizeVariants}
        showPricesBam={showPricesBam}
        showPricesEur={showPricesEur}
      />
      {item && (
        <select
          name="isAvailable"
          defaultValue={item.isAvailable ? "true" : "false"}
          className={inputClass}
        >
          <option value="true">Aktivno i prikazano na meniju</option>
          <option value="false">Deaktivirano i skriveno s menija</option>
        </select>
      )}
      <div>
        <label className="mb-1 block text-sm text-slate-600">
          Slika artikla (opcijski)
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className={`${inputClass} w-full text-sm`}
        />
      </div>
    </>
  );
}

export function DailyOfferPanel({
  items,
  showPricesBam,
  showPricesEur,
  activeLanguages,
  createAction,
  updateAction,
  deleteAction,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dnevna ponuda</h2>
        <p className="mt-1 text-sm text-slate-600">
          Dodaj artikle koji se prikazuju iznad redovnog menija i mijenjaju se
          iz dana u dan.
        </p>
      </div>

      <ToastForm
        action={createAction}
        successMessage="Artikal dnevne ponude je uspješno dodan!"
        className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4"
        encType="multipart/form-data"
        resetOnSuccess
      >
        <h3 className="font-semibold text-slate-900">Dodaj u dnevnu ponudu</h3>
        <DailyOfferFields
          showPricesBam={showPricesBam}
          showPricesEur={showPricesEur}
          activeLanguages={activeLanguages}
        />
        <FormActionButton
          idleLabel="Dodaj artikl"
          loadingLabel="Dodajem..."
          className="w-fit rounded-full bg-emerald-600 px-5 py-2 text-white transition hover:bg-emerald-700 disabled:opacity-70"
        />
      </ToastForm>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Trenutna dnevna ponuda</h3>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nema artikala u dnevnoj ponudi.
          </p>
        ) : (
          items.map((item) => (
            <ToastForm
              key={item._id}
              action={updateAction}
              successMessage="Artikal dnevne ponude je uspješno ažuriran!"
              deleteAction={deleteAction}
              deleteSuccessMessage="Artikal dnevne ponude je uspješno obrisan!"
              deleteConfirmMessage="Jeste li sigurni da želite obrisati ovaj artikal dnevne ponude?"
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4"
              encType="multipart/form-data"
            >
              <input type="hidden" name="itemId" value={item._id} />
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-medium text-slate-900">{item.name}</h4>
                <span
                  className={`text-xs font-semibold ${item.isAvailable ? "text-emerald-600" : "text-slate-400"}`}
                >
                  {item.isAvailable ? "Aktivno" : "Deaktivirano"}
                </span>
              </div>
              <DailyOfferFields
                item={item}
                showPricesBam={showPricesBam}
                showPricesEur={showPricesEur}
                activeLanguages={activeLanguages}
              />
              <div className="flex gap-2">
                <FormActionButton
                  idleLabel="Spremi"
                  loadingLabel="Spremam..."
                  className="w-fit rounded bg-blue-500 px-4 py-2 text-xs text-white transition hover:bg-blue-600 disabled:opacity-70"
                />
                <FormActionButton
                  idleLabel="Obriši"
                  loadingLabel="Brišem..."
                  data-toast-action="delete"
                  className="w-fit rounded bg-red-500 px-4 py-2 text-xs text-white transition hover:bg-red-600 disabled:opacity-70"
                />
              </div>
            </ToastForm>
          ))
        )}
      </div>
    </div>
  );
}
