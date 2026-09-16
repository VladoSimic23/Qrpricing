"use client";

import { FormEvent, useState } from "react";

const contactEmail = "vladimir.simic@digitalcjenik.com";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent("Poruka sa web stranice");
    const body = encodeURIComponent(
      `Ime: ${formData.name}\nEmail: ${formData.email}\n\nPoruka:\n${formData.message}`,
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative overflow-hidden border-t border-slate-800 bg-slate-950 py-16 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center sm:mb-10">
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            Kontakt
          </span>
          <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Javite nam se i dogovorite demo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Postavite pitanje, zatražite ponudu ili jednostavno pošaljite
            poruku. Odgovorit ćemo vam na najkraćem mogućem roku.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-emerald-500/5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Ime
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Vaše ime"
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="vas@email.com"
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Poruka
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Napišite nam što vam je potrebno..."
                  required
                  className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Pošalji poruku
              </button>
            </form>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-5 sm:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/80 sm:text-sm">
                Direktni kontakt
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-4 block break-all text-xl font-bold leading-tight text-white transition hover:text-emerald-400 sm:text-2xl lg:text-3xl"
              >
                {contactEmail}
              </a>
              <p className="mt-4 text-sm text-slate-300 sm:text-base">
                Za brze upite, ponude i dogovore s posjetiteljima,
                najjednostavnije je poslati poruku direktno na ovu adresu.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-white">Brzi odgovor</p>
              </div>
              <p className="mt-4 text-slate-400">
                Vrlo često odgovaramo unutar nekoliko sati, ovisno o opterećenju
                i vrsti upita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
