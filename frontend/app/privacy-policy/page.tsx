import type { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Politika privatnosti - QR Cjenik",
  description:
    "Pročitajte politiku privatnosti i kako tretiramo vaše podatke na platformi digitalcjenik.com",
});

export default function PrivacyPolicy() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* Header */}
      <section className="mx-auto w-full max-w-4xl px-6 pt-16 pb-12">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-6">
          Pravni dokumenti
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white mb-3">
          Politika privatnosti
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
            1. Podaci koje prikupljamo
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Prikupljamo samo nužne podatke potrebne za pružanje usluge:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Podaci o računu:</strong> E-mail
                adresa i ime prikupljeni putem Clerk servisa prilikom
                registracije.
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Podaci o objektu:</strong> Naziv
                restorana, adresa, jelovnici i cijene.
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Tehnički podaci:</strong> IP
                adresa i osnovni podaci o pregledniku radi sigurnosti i
                analitike.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            2. Kako koristimo podatke
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Za omogućavanje pristupa administraciji cjenika.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Za komunikaciju s korisnicima u vezi tehničkih ažuriranja ili
              računa.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Za osiguravanje ispravnog prikaza cjenika krajnjim posjetiteljima
              (gostima restorana).
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            3. Treće strane i obrada podataka
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Vaši podaci se obrađuju putem sljedećih provjerenih servisa:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Clerk:</strong> Za sigurnu
                prijavu i upravljanje korisnicima.
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Vercel:</strong> Za hosting
                aplikacije i baze podataka.
              </span>
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-white">Sanity.io / WordPress:</strong>{" "}
                Za pohranu sadržaja cjenika.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            4. Kolačići (Cookies)
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Koristimo isključivo nužne kolačiće za održavanje korisničke sesije
            i sigurnost sustava. Ne koristimo invazivne kolačiće za praćenje
            trećih strana bez privole.
          </p>
        </div>

        {/* Section 5 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-xl font-bold text-emerald-400 mb-4">
            5. Vaša prava (GDPR)
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            U skladu s GDPR uredbom, imate pravo na:
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Pristup svojim podacima.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Ispravak netočnih podataka.
            </li>
            <li className="flex items-start gap-3 text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              Brisanje podataka (&ldquo;pravo na zaborav&rdquo;).
            </li>
          </ul>
          <div className="border-t border-slate-700 pt-6">
            <p className="text-slate-300">
              Zahtjev za brisanjem podataka šalje se na:{" "}
              <a
                href="mailto:info@digitalcjenik.com"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                info@digitalcjenik.com
              </a>
            </p>
          </div>
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
