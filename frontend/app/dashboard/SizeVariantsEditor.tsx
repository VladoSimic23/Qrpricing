"use client";

import { useState } from "react";

type SizeVariant = { label: string; price: number };

type Row = { id: string; label: string; price: number | string };

type Props = {
  defaultPrice?: number;
  defaultCurrency?: "EUR" | "BAM";
  defaultVariants?: SizeVariant[];
};

const inputClass =
  "rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export function SizeVariantsEditor({
  defaultPrice,
  defaultCurrency,
  defaultVariants,
}: Props) {
  const [enabled, setEnabled] = useState(
    !!defaultVariants && defaultVariants.length > 0,
  );
  const [rows, setRows] = useState<Row[]>(() =>
    defaultVariants && defaultVariants.length > 0
      ? defaultVariants.map((v, i) => ({
          id: `v-${i}`,
          label: v.label,
          price: v.price,
        }))
      : [
          { id: "v-0", label: "Mala", price: "" },
          { id: "v-1", label: "Velika", price: "" },
        ],
  );

  function addRow() {
    setRows((r) => [...r, { id: `v-${Date.now()}`, label: "", price: "" }]);
  }

  function removeRow(id: string) {
    setRows((r) => (r.length > 1 ? r.filter((row) => row.id !== id) : r));
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Artikl ima više veličina (npr. mala/velika)
      </label>

      {!enabled ? (
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={defaultPrice}
          placeholder="Cijena (0.00)"
          className={inputClass}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div key={row.id} className="flex gap-2">
              <input
                name="sizeLabel"
                defaultValue={row.label}
                placeholder="Naziv veličine (npr. Mala)"
                className={`min-w-0 flex-1 ${inputClass}`}
              />
              <input
                name="sizePrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={row.price}
                placeholder="Cijena"
                className={`w-28 ${inputClass}`}
              />
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="Ukloni veličinu"
                  className="rounded-xl border border-slate-300 px-3 text-slate-500 transition hover:bg-slate-100"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="w-fit rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
          >
            + Dodaj veličinu
          </button>
        </div>
      )}

      <select
        name="currency"
        defaultValue={defaultCurrency || "BAM"}
        className={inputClass}
      >
        <option value="EUR">EUR</option>
        <option value="BAM">KM</option>
      </select>
    </div>
  );
}
