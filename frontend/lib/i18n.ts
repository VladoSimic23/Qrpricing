export const supportedLocales = ["hr", "en"] as const;

export type Locale = (typeof supportedLocales)[number];

type HomeMessages = {
  signedInUser: string;
  signOut: string;
  heroTitle: string;
  heroDescription: string;
  openDashboard: string;
  adminStudio: string;
  publicMenuExample: string;
  signIn: string;
  signUp: string;
  languageLabel: string;
};

type MenuMessages = {
  digitalMenu: string;
  categories: string;
  subcategories: string;
  close: string;
  all: string;
  noSubcategory: string;
  noItemsAvailable: string;
  noItemsInCategory: string;
  menuNotAvailable: string;
  openCategories: string;
  openSubcategories: string;
  closeMobileMenu: string;
  languageLabel: string;
};

export type AppMessages = {
  home: HomeMessages;
  menu: MenuMessages;
};

export const messages: Record<Locale, AppMessages> = {
  hr: {
    home: {
      signedInUser: "prijavljen korisnik",
      signOut: "Odjavi se",
      heroTitle: "Jedna platforma za digitalni meni svih tvojih klijenata.",
      heroDescription:
        "Multi-tenant sustav za kafiće i restorane: svaki lokal ima svoj URL, svoj login i svoj dashboard, a ti upravljaš svime iz jednog projekta.",
      openDashboard: "Otvori Dashboard",
      adminStudio: "Admin Studio",
      publicMenuExample: "Primjer javnog menija",
      signIn: "Prijava",
      signUp: "Registracija",
      languageLabel: "Jezik",
    },
    menu: {
      digitalMenu: "Digitalni meni",
      categories: "Kategorije",
      subcategories: "Podkategorije",
      close: "Zatvori",
      all: "Sve",
      noSubcategory: "Bez podkategorije",
      noItemsAvailable: "Nema dostupnih artikala.",
      noItemsInCategory: "Nema dostupnih artikala u ovoj kategoriji.",
      menuNotAvailable: "Meni još nije dostupan.",
      openCategories: "Otvori kategorije",
      openSubcategories: "Otvori podkategorije",
      closeMobileMenu: "Zatvori mobilni meni",
      languageLabel: "Jezik",
    },
  },
  en: {
    home: {
      signedInUser: "signed in user",
      signOut: "Sign out",
      heroTitle: "One platform for digital menus across all your clients.",
      heroDescription:
        "A multi-tenant system for cafes and restaurants: each venue gets its own URL, login, and dashboard while you manage everything from one project.",
      openDashboard: "Open Dashboard",
      adminStudio: "Admin Studio",
      publicMenuExample: "Public menu example",
      signIn: "Sign in",
      signUp: "Sign up",
      languageLabel: "Language",
    },
    menu: {
      digitalMenu: "Digital menu",
      categories: "Categories",
      subcategories: "Subcategories",
      close: "Close",
      all: "All",
      noSubcategory: "No subcategory",
      noItemsAvailable: "No items available.",
      noItemsInCategory: "No items available in this category.",
      menuNotAvailable: "Menu is not available yet.",
      openCategories: "Open categories",
      openSubcategories: "Open subcategories",
      closeMobileMenu: "Close mobile menu",
      languageLabel: "Language",
    },
  },
};

function normalizeLocale(value?: string | null): Locale | null {
  if (!value) return null;

  const language = value.toLowerCase().split(",")[0].trim().split("-")[0];

  return supportedLocales.includes(language as Locale)
    ? (language as Locale)
    : null;
}

export function resolveLocale(
  preferred?: string | null,
  acceptLanguageHeader?: string | null,
): Locale {
  return (
    normalizeLocale(preferred) ?? normalizeLocale(acceptLanguageHeader) ?? "hr"
  );
}

export function withLang(path: string, locale: Locale): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=${locale}`;
}
