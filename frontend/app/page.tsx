import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            QR CJENIK
          </p>
          {userId ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-300/60 px-4 py-2 text-xs text-emerald-200">
                prijavljen korisnik
              </span>
              <SignOutButton redirectUrl="/">
                <button className="rounded-full border border-red-400/60 px-4 py-2 text-xs text-red-200 hover:bg-red-400/10 transition-colors">
                  Odjavi se
                </button>
              </SignOutButton>
            </div>
          ) : null}
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          Jedna platforma za digitalni meni svih tvojih klijenata.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-200">
          Multi-tenant sustav za kafice i restorane: svaki lokal ima svoj URL,
          svoj login i svoj dashboard, a ti upravljas svime iz jednog projekta.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Otvori Dashboard
          </Link>
          <Link
            href="/studio"
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold"
          >
            Admin Studio
          </Link>
          <Link
            href="/menu/demo-lokal"
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold"
          >
            Primjer javnog menija
          </Link>
        </div>

        {!userId ? (
          <div className="mt-10 flex gap-3">
            <Link
              href="/sign-in"
              className="rounded-full border border-emerald-300/60 px-6 py-3 text-sm font-semibold text-emerald-200"
            >
              Prijava
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-emerald-300/60 px-6 py-3 text-sm font-semibold text-emerald-200"
            >
              Registracija
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
