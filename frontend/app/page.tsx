import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { headers } from "next/headers";
import type { Metadata } from "next";

import {
  messages,
  resolveLocale,
  supportedLocales,
  withLang,
} from "@/lib/i18n";
import { generateMetadata as generateSeoMetadata, siteConfig } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Digitalni Meniji za Restorane - QR Cjenik",
  description:
    "Brzo kreirajte interaktivne digitalne menije za vaš restoran ili kafić. Ažuriranja u sekundi, bez tiskanja, sa QR kodovima i dinamičkim cijenama.",
  keywords: [
    "digitalni meni",
    "QR meni",
    "meni za restoran",
    "meni za kafić",
    "digitalni cjenik",
    "meni aplikacija",
    "elektronski meni",
  ],
  openGraph: {
    title: "Digitalni Meniji za Restorane - QR Cjenik",
    description:
      "Brzo kreirajte interaktivne digitalne menije za vaš restoran ili kafić.",
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "QR Cjenik - Digitalni Meniji",
      },
    ],
  },
});

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const requestHeaders = await headers();
  const locale = resolveLocale(lang, requestHeaders.get("accept-language"));
  const t = messages[locale].home;
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* 1. HERO SEKCIJA (PRVI DOJAM) */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pt-10 pb-20 lg:pt-16 lg:pb-32">
        {/* Navigation Bar / Login State */}
        <div className="mb-16 flex items-center justify-between">
          <p className="text-xl font-bold tracking-widest text-emerald-400">
            QR CJENIK
          </p>
          {userId ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block rounded-full bg-slate-900 border border-emerald-500/30 px-4 py-2 text-xs font-medium text-emerald-300">
                Prijavljeni ste
              </span>
              <Link
                href={withLang("/dashboard", locale)}
                className="text-sm font-semibold hover:text-emerald-400 transition-colors"
              >
                Dashboard
              </Link>
              <SignOutButton redirectUrl={withLang("/", locale)}>
                <button className="rounded-full border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
                  {t.signOut}
                </button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href={withLang("/sign-in", locale)}
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Prijava
              </Link>
              <Link
                href={withLang("/sign-up", locale)}
                className="hidden rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 transition-colors sm:block"
              >
                Besplatna proba
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl leading-tight">
              Moderni digitalni meniji <br className="hidden sm:block" />
              za vaš <span className="text-emerald-400">restoran</span>
              <br className="hidden sm:block" />
              <span className="text-2xl sm:text-4xl xl:text-5xl ml-2 font-medium text-slate-400">
                — brže, jeftinije, preglednije.
              </span>
            </h1>
            <p className="max-w-xl text-lg sm:text-xl text-slate-400 leading-relaxed">
              Pretvorite svoj papirnati cjenik u interaktivni digitalni meni
              koji gosti obožavaju, a vi ga ažurirate u sekundi, bez potrebe za
              tiskanjem novih primjeraka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={
                  userId
                    ? withLang("/dashboard", locale)
                    : withLang("/sign-up", locale)
                }
                className="flex items-center justify-center rounded-full bg-emerald-500 px-8 py-4 text-bases font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-[1.02] transition-all"
              >
                Zatražite besplatnu demo verziju
              </Link>
              <Link
                href="#demo"
                className="flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/50 px-8 py-4 text-base font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Kako izgleda?
              </Link>
            </div>
          </div>

          <div className="flex-1 right-visual-mockup relative w-full max-w-md lg:max-w-full">
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/30 to-blue-500/10 blur-2xl opacity-60"></div>
            <div className="relative mx-auto w-[280px] sm:w-[320px] rounded-[2.5rem] border-[8px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden aspect-[9/19] flex flex-col pt-6">
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto"></div>
              {/* Mockup Screen Content */}
              <div className="px-5 py-4 flex-1 overflow-hidden opacity-90">
                <div className="h-32 rounded-2xl bg-slate-800 mb-6 flex items-center justify-center">
                  <span className="text-slate-600 font-bold tracking-widest text-sm">
                    VAŠ LOKAL
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-3 w-40 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-5 w-12 bg-emerald-500/80 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                      <div className="h-3 w-32 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-5 w-12 bg-emerald-500/80 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-200 rounded"></div>
                      <div className="h-3 w-48 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-5 w-12 bg-emerald-500/80 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM & RJEŠENJE */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Problem s papirnatim menijima
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Stare cijene, visoki troškovi tiska i gubitak vremena
              </h2>
              <p className="text-lg text-slate-400">
                Poderani cjenici odbijaju goste. Često mijenjanje cijena
                zahtijeva ponovni tisak, a konobari gube dragocjeno vrijeme
                objašnjavajući ponudu umjesto da poslužuju goste.
              </p>
            </div>

            <div className="space-y-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/20 p-8 lg:p-12">
              <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Naše rješenje
              </div>
              <h3 className="text-2xl font-bold text-white">
                Digitalno, uvijek točno i elegantno
              </h3>
              <p className="text-lg text-slate-300">
                Vaš je meni od sada{" "}
                <strong className="text-emerald-400">uvijek točan</strong>,
                dostupan na{" "}
                <strong className="text-emerald-400">više jezika</strong> i
                izgleda fantastično na dlanu svakog gosta, optimiziran za svaki
                ekran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KLJUČNE PREDNOSTI */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Zašto baš naš digitalni meni?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Sve što vam treba za smanjenje troškova i oduševljenje gostiju.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 mb-5">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Brza izmjena</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Promijenite cijene iz kreveta ili dodajte novi specijalitet.
              Izmjene su odmah vidljive gostu na stolu.
            </p>
          </div>
          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 mb-5">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Višejezičnost</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatski prijevod na engleski, njemački i druge jezike - ključno
              za turiste i bržu uslugu.
            </p>
          </div>
          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 mb-5">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bez tiska</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Zaboravite skupe troškove tiska, dizajnere i plastificiranje pri
              svakom novom piću.
            </p>
          </div>
          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col items-start hover:border-emerald-500/30 transition-colors">
            <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400 mb-5">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ultrabrzo</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Meni je savršeno optimiziran i učitava se trenutno, pa čak i na
              vrlo lošoj 3G / Wi-Fi mreži.
            </p>
          </div>
        </div>
      </section>

      {/* 4. KAKO TO RADI */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl text-white">
              Jednostavan proces
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Nema preuzimanja aplikacija brže posluživanje gostiju.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line hidden on mobile */}
            <div className="hidden sm:block absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-emerald-500/10 via-emerald-500/50 to-emerald-500/10 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 border-8 border-slate-900 shadow-xl text-3xl font-extrabold text-emerald-400">
                1
              </div>
              <h3 className="text-2xl font-bold text-white">Skenirajte</h3>
              <p className="text-slate-400">
                Gost sjeda za stol i svojom kamerom skenira elegantni QR kod.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 border-8 border-slate-900 shadow-xl text-3xl font-extrabold text-emerald-400">
                2
              </div>
              <h3 className="text-2xl font-bold text-white">Odaberite</h3>
              <p className="text-slate-400">
                Pretražuje jelovnik ili kartu pića prema vizualnim kategorijama.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-950 border-8 border-slate-900 shadow-xl text-3xl font-extrabold text-emerald-400">
                3
              </div>
              <h3 className="text-2xl font-bold text-white">Uživajte</h3>
              <p className="text-slate-400">
                Bez čekanja da konobar donese papir - odmah zna što želi
                naručiti!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LIVE DEMO */}
      <section
        id="demo"
        className="relative mx-auto max-w-5xl px-6 py-24 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none rounded-[3rem]"></div>

        <h2 className="text-4xl font-extrabold text-white mb-6 relative z-10">
          Probaj odmah! Skeniraj kod.
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto relative z-10">
          Uzmite svoj mobitel, skenirajte ovaj kod i provjerite uživo kako će
          moderni i fluidni digitalni meni izgledati u vašem lokalu.
        </p>

        <div className="mx-auto w-64 h-64 bg-white rounded-3xl p-4 shadow-2xl shadow-emerald-500/20 relative z-10 hover:scale-105 transition-transform cursor-pointer group">
          <Link
            href={withLang("/menu/ime-restorana", locale)}
            className="block w-full h-full relative"
            aria-label="Otvori demo meni"
          >
            <Image
              src="/test.png"
              alt="Demo QR kod"
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 768px) 100vw, 256px"
            />
            <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-sm">
              <span className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-lg">
                Klikni za Demo
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. SOCIAL PROOF */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">
          <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-8">
            Što kažu zadovoljni klijenti
          </p>
          <blockquote className="text-2xl sm:text-3xl font-medium leading-normal text-white mb-10 max-w-4xl mx-auto">
            Od kada koristimo digitalni meni, manje nam se gužvaju konobari i
            gosti su puno zadovoljniji jer ne moraju čekati meni. Ujedno štedimo
            tisuće eura godišnje na tiskanju.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border-2 border-emerald-500">
              <span className="text-xl font-bold font-serif text-slate-300">
                C
              </span>
            </div>
            <div className="text-left">
              <p className="font-bold text-lg text-white">Vlasnik kafića X.</p>
              <p className="text-slate-400">Coffee Bar Center</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-24 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">
                Spremni za moderan iskorak?
              </h2>
              <p className="text-slate-400 mb-8 max-w-md">
                Javite nam se još danas i besplatno ćemo vam pokazati kako
                digitalni ekosustav može unaprijediti vaš biznis.
              </p>
              <Link
                href={withLang("/sign-up", locale)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-emerald-400 transition-colors"
              >
                Želim digitalni meni za svoj lokal
              </Link>
            </div>

            <div className="flex flex-col gap-6 md:pl-16 md:border-l border-slate-800">
              <a
                href="tel:+385991234567"
                className="group flex items-center text-lg text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <svg
                  className="w-6 h-6 mr-4 text-emerald-500 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +385 99 123 4567
              </a>
              <a
                href="mailto:info@qrcjenik.hr"
                className="group flex items-center text-lg text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <svg
                  className="w-6 h-6 mr-4 text-emerald-500 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@qrcjenik.hr
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between border-t border-slate-800 pt-8 text-sm text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} QR CJENIK. Sva prava pridržana.
            </p>
            <div className="mt-4 flex gap-6 md:mt-0">
              <Link
                href="/terms"
                className="hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Language Switcher Overlay */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/90 p-1.5 shadow-xl backdrop-blur-md">
          {supportedLocales.map((code) => (
            <Link
              key={code}
              href={withLang("/", code)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                locale === code
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {code}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
