"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

type TenantOption = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

type Props = {
  tenants: TenantOption[];
  baseUrl: string;
};

function slugToFileName(value: string) {
  return value.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "qr";
}

export function QrGeneratorClient({ tenants, baseUrl }: Props) {
  const initialTenant = tenants[0] ?? null;
  const [selectedTenantId, setSelectedTenantId] = useState(
    initialTenant?._id ?? "",
  );
  const [size, setSize] = useState(320);
  const [customLabel, setCustomLabel] = useState(initialTenant?.name ?? "");
  const [copied, setCopied] = useState(false);
  const previewId = useId();
  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedTenant =
    tenants.find((tenant) => tenant._id === selectedTenantId) ?? initialTenant;
  const menuUrl = selectedTenant
    ? `${baseUrl}/menu/${selectedTenant.slug}`
    : "";
  const fileName = selectedTenant
    ? `${slugToFileName(selectedTenant.slug)}-menu-qr.svg`
    : "menu-qr.svg";

  useEffect(() => {
    if (!selectedTenant) {
      return;
    }

    setCustomLabel(selectedTenant.name);
  }, [selectedTenant]);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleDownload = () => {
    const svgElement = svgContainerRef.current?.querySelector("svg");
    if (!svgElement) {
      return;
    }

    const serializer = new XMLSerializer();
    const svgMarkup = serializer.serializeToString(svgElement);
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(blobUrl);
  };

  const handleCopy = async () => {
    if (!menuUrl) {
      return;
    }

    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                Admin Only
              </p>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                QR generator za klijente
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Odaberi klijenta, pregledaj javni URL menija i preuzmi QR kod
                kao čisti SVG.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/dashboard"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-medium text-slate-100 transition hover:border-emerald-400/40 hover:bg-white/10"
              >
                Dashboard
              </Link>
              <Link
                href="/studio"
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 font-medium text-emerald-200 transition hover:bg-emerald-400/20"
              >
                Sanity Studio
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 shadow-xl backdrop-blur sm:p-8">
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm text-slate-200">
                Klijent
                <select
                  value={selectedTenantId}
                  onChange={(event) => setSelectedTenantId(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                >
                  {tenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.name} {tenant.isActive ? "" : "(neaktivan)"}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-slate-200">
                Naziv ispod QR-a
                <input
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  placeholder="Naziv klijenta"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-200">
                Veličina SVG-a
                <input
                  type="number"
                  min="128"
                  max="1024"
                  step="16"
                  value={size}
                  onChange={(event) =>
                    setSize(Number(event.target.value) || 320)
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </label>

              <div className="grid gap-2 text-sm text-slate-200">
                <span>Javni URL menija</span>
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <code className="break-all text-xs text-emerald-200 sm:text-sm">
                    {menuUrl || "Odaberi klijenta"}
                  </code>
                  <button
                    type="button"
                    onClick={() => void handleCopy()}
                    disabled={!menuUrl}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? "Kopirano" : "Kopiraj URL"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!menuUrl}
                  className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Preuzmi SVG
                </button>
                {menuUrl && (
                  <Link
                    href={menuUrl}
                    target="_blank"
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Otvori meni
                  </Link>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              SVG Preview
            </p>
            <div className="mt-5 rounded-[1.75rem] bg-[linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] p-6 shadow-inner">
              <div
                className="rounded-[1.5rem] bg-white p-5 shadow-lg"
                ref={svgContainerRef}
              >
                {menuUrl ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <QRCodeSVG
                      key={`${menuUrl}-${size}`}
                      value={menuUrl}
                      size={size}
                      level="H"
                      marginSize={2}
                      title={
                        customLabel || selectedTenant?.name || "QR kod menija"
                      }
                      aria-labelledby={previewId}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                    />
                    <div className="space-y-1">
                      <p
                        id={previewId}
                        className="text-lg font-semibold text-slate-900"
                      >
                        {customLabel || selectedTenant?.name}
                      </p>
                      <p className="break-all text-xs text-slate-500">
                        {menuUrl}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center text-sm text-slate-500">
                    Nema dostupnih klijenata za generiranje QR koda.
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              SVG ostaje vektorski i spreman je za tisak, naljepnice i stolne
              kartice bez gubitka kvalitete.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
