import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import { headers } from "next/headers";

import {
  messages,
  resolveLocale,
  supportedLocales,
  withLang,
} from "@/lib/i18n";

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
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
              QR CJENIK
            </p>
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-1 py-1">
              {supportedLocales.slice(0, 2).map((code) => (
                <Link
                  key={code}
                  href={withLang("/", code)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    locale === code
                      ? "bg-emerald-400 text-slate-950"
                      : "text-slate-200"
                  }`}
                >
                  {code}
                </Link>
              ))}
            </div>
          </div>
          {userId ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-emerald-300/60 px-4 py-2 text-xs text-emerald-200">
                {t.signedInUser}
              </span>
              <SignOutButton redirectUrl={withLang("/", locale)}>
                <button className="rounded-full border border-red-400/60 px-4 py-2 text-xs text-red-200 hover:bg-red-400/10 transition-colors">
                  {t.signOut}
                </button>
              </SignOutButton>
            </div>
          ) : null}
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
          {t.heroTitle}
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-200">
          {t.heroDescription}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={withLang("/dashboard", locale)}
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950"
          >
            {t.openDashboard}
          </Link>
          <Link
            href={withLang("/studio", locale)}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold"
          >
            {t.adminStudio}
          </Link>
          <Link
            href={withLang("/menu/demo-lokal", locale)}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold"
          >
            {t.publicMenuExample}
          </Link>
        </div>

        {!userId ? (
          <div className="mt-10 flex gap-3">
            <Link
              href={withLang("/sign-in", locale)}
              className="rounded-full border border-emerald-300/60 px-6 py-3 text-sm font-semibold text-emerald-200"
            >
              {t.signIn}
            </Link>
            <Link
              href={withLang("/sign-up", locale)}
              className="rounded-full border border-emerald-300/60 px-6 py-3 text-sm font-semibold text-emerald-200"
            >
              {t.signUp}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
