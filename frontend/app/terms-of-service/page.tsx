import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Uvjeti korištenja - QR Cjenik",
  description:
    "Pročitajte uvjete korištenja i terms of service platforme digitalcjenik.com",
});

export default function TermsOfService() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
          Pravni dokumenti
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white mb-3">
          Uvjeti korištenja
        </h1>
        <p className="text-lg text-slate-400">
          Posljednja izmjena: 5. svibnja 2026.
        </p>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 space-y-8">
        {/* Section 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            1. Opis usluge
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Digitalcjenik.com je Software-as-a-Service (SaaS) platforma koja
            ugostiteljskim objektima omogućuje izradu, upravljanje i prikaz
            digitalnih jelovnika putem QR kodova.
          </p>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            2. Registracija i korisnički račun
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Za korištenje usluge potrebna je registracija putem Clerk sustava
              za autentifikaciju.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Korisnik je odgovoran za čuvanje povjerljivosti svojih pristupnih
              podataka.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Korisnik se obvezuje unositi točne podatke o svom ugostiteljskom
              objektu.
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            3. Pretplata i plaćanje
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Usluga se naplaćuje prema važećem cjeniku na bazi mjesečne ili
              godišnje licence.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Plaćanje se vrši transakcijski na račun obrta (ili dogovorenim
              metodama tijekom testne faze).
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Zadržavamo pravo promjene cijena uz prethodnu obavijest
              korisnicima.
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            4. Intelektualno vlasništvo
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Sav softverski kod, dizajn i vizualni identitet platforme su
              vlasništvo digitalcjenik.com.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Sadržaj koji korisnik unese (opisi hrane, slike, cijene) ostaje u
              vlasništvu korisnika.
            </li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            5. Ograničenje odgovornosti
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Digitalcjenik.com ne odgovara za točnost podataka (cijena, opisa
              jela) koje unose korisnici.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Ne jamčimo 100% dostupnost usluge u slučaju prekida rada trećih
              strana (Vercel, hosting provideri).
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto max-w-4xl px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} QR CJENIK. Sva prava pridržana.
          </p>
          <div className="flex gap-6">
            <a
              href="/privacy-policy"
              className="hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
