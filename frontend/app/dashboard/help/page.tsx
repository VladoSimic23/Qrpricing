import Link from "next/link";
import type { Metadata } from "next";

import { generateMetadata as generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Pomoć - Dashboard | QR Cjenik",
  description: "Vodič za korištenje dashboarda za upravljanje digitalnim menijem.",
  robots: {
    index: false,
    follow: false,
  },
});

type Section = {
  title: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    title: "1. Prijava u aplikaciju",
    body: (
      <p>
        Na{" "}
        <a
          href="https://www.digitalcjenik.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 underline"
        >
          digitalcjenik.com
        </a>{" "}
        u gornjem desnom kutu kliknite &quot;Prijava&quot;. U prozoru koji se
        otvori kliknite &quot;Continue with Google&quot; (prijava e-mailom
        trenutno nije dostupna). Provjerite da ste već prijavljeni u Google
        račun koji koristite za cjenik — ako je to jedini aktivni Google račun
        u vašem pregledniku, prijava će vas automatski odvesti na
        dashboard.
      </p>
    ),
  },
  {
    title: "2. Upravljačka ploča (Dashboard)",
    body: (
      <p>
        Ovdje upravljate cijelim sadržajem cjenika: dodajete artikle,
        kategorije i dnevnu ponudu, i mijenjate postavke prikaza.
      </p>
    ),
  },
  {
    title: "3. Kategorije",
    body: (
      <p>
        Prazan cjenik prvo treba barem jednu kategoriju jer svaki artikl mora
        pripadati kategoriji. U izborniku odaberite &quot;Dodaj
        kategoriju&quot;, upišite naziv na hrvatskom i/ili engleskom i
        kliknite &quot;Spremi kategoriju&quot;. U tabu &quot;Kategorije&quot;
        možete uređivati naziv, brisati kategoriju, ili je premjestiti
        povlačenjem znaka ☰ (na mobitelu pritisnite i držite pa povucite) —
        redoslijed se sprema automatski, čim je pustite.
      </p>
    ),
  },
  {
    title: "4. Dodaj artikl i podkategorije",
    body: (
      <p>
        Unesite naziv (hrvatski i/ili engleski) i opis (npr. sastojke za
        jelo). Ako artikl dolazi u više veličina s različitim cijenama (npr.
        pivo 0.3l/0.5l), označite kvadratić &quot;Artikl ima više
        veličina&quot; — otvorit će se polja za svaku veličinu i cijenu.
        Gostima će se cijene prikazati zajedno pored naziva, razdvojene kosom
        crtom (npr. 10 € / 20 €). Ako artikl ima samo jednu cijenu, kvadratić
        ostaje neoznačen. Nakon cijene odaberite kategoriju kojoj artikl
        pripada. Podkategorije (npr. &quot;Roštilj&quot; unutar
        &quot;Jela&quot;) dodajete u tabu &quot;Artikli po kategorijama&quot;,
        a zatim kliknete &quot;Prikaži detalje&quot; na artiklu i odaberete
        podkategoriju — tu isto možete uređivati cijeli artikl. Slika je
        opcionalna — kliknite &quot;Choose file&quot; i odaberite sliku s
        uređaja.
      </p>
    ),
  },
  {
    title: "5. Dnevna ponuda",
    body: (
      <p>
        Radi slično kao &quot;Dodaj artikl&quot;, ali se artikli automatski
        svrstavaju u posebnu kategoriju &quot;Dnevna ponuda&quot; (ili
        &quot;Daily offer&quot;), koja se u meniju prikazuje na prvom mjestu.
        Dodani artikli se prikazuju ispod forme za dodavanje, gdje ih uređujete
        ili deaktivirate (bez brisanja) kad ponuda istekne. Možete imati više
        aktivnih artikala odjednom. Ako nijedan artikl nije aktivan, kategorija
        &quot;Dnevna ponuda&quot; se u meniju uopće ne prikazuje.
      </p>
    ),
  },
  {
    title: "6. Postavke",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Tečaj EUR → KM</strong> — unosite samo ako prikazujete
          cijene u obje valute.
        </li>
        <li>
          <strong>Naziv restorana</strong> — mijenja ime prikazano na javnoj
          stranici menija.
        </li>
        <li>
          <strong>Sakrij naslov &quot;Digitalni Meni&quot;</strong> — uklanja
          mali naslov iznad naziva restorana.
        </li>
        <li>
          <strong>Dizajn javnog menija</strong> — birate između
          &quot;Classic&quot; (tamna tema) i &quot;Editorial&quot; (svijetla
          tema).
        </li>
        <li>
          <strong>Prikazuj cijene u KM / EUR</strong> — dva odvojena
          kvadratića; barem jedan mora ostati uključen.
        </li>
        <li>
          <strong>Poruka o zabrani točenja alkohola</strong> — prikazuje se u
          podnožju menija.
        </li>
        <li>
          <strong>Aktivni jezici</strong> — birate hrvatski i/ili engleski
          prikaz menija.
        </li>
        <li>
          <strong>Društvene mreže</strong> — linkovi (Instagram, Facebook,
          TikTok, web stranica) prikazuju se u podnožju menija.
        </li>
        <li>
          <strong>Opasna zona</strong> — dugme &quot;Obriši cjenik i
          restoran&quot; trajno briše sve podatke; koristite samo ako želite
          potpuno ugasiti cjenik.
        </li>
      </ul>
    ),
  },
];

export default function DashboardHelpPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-slate-900">Pomoć</h1>
        <Link
          href="/dashboard"
          className="whitespace-nowrap rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
        >
          Natrag na dashboard
        </Link>
      </div>
      <p className="text-slate-600">
        Kratki vodič kroz sve dijelove dashboarda za upravljanje digitalnim
        menijem.
      </p>
      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {section.title}
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-slate-700">
              {section.body}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
