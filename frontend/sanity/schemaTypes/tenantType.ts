import { defineField, defineType } from "sanity";

export const tenantType = defineType({
  name: "tenant",
  title: "Tenant",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Naziv lokala",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "nameEn",
      title: "Naziv lokala (EN)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Public slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exchangeRateEurToBam",
      title: "Tecaj EUR -> KM",
      description:
        "Unesi trenutni tecaj po kojem se prikazuju cijene u obje valute.",
      type: "number",
      initialValue: 1.95583,
      validation: (rule) => rule.required().positive().min(0.0001).precision(5),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "hideDigitalMenuHeader",
      title: "Sakrij naslov 'Digitalni Meni'",
      type: "boolean",
      initialValue: false,
      description:
        "Ako je uključeno, naslov 'Digitalni Meni' neće biti prikazan",
    }),
    defineField({
      name: "showPricesBam",
      title: "Prikazi cijene u KM",
      type: "boolean",
      initialValue: true,
      description:
        "Ako je isključeno, cijene u KM se neće prikazivati u meniju.",
    }),
    defineField({
      name: "showPricesEur",
      title: "Prikazi cijene u EUR",
      type: "boolean",
      initialValue: true,
      description:
        "Ako je isključeno, cijene u EUR se neće prikazivati u meniju.",
    }),
    defineField({
      name: "isActive",
      title: "Aktivan",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "activeLanguages",
      title: "Aktivni jezici",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Hrvatski", value: "hr" },
          { title: "Engleski", value: "en" },
        ],
        layout: "grid",
      },
      initialValue: ["hr", "en"],
      description:
        "Odaberite koji će jezici biti prikazani. Neaktivni jezici bit će skriveni, ali uneseni podaci ostaju sačuvani.",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook (URL)",
      type: "url",
      description: "Link na vaš Facebook profil",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram (URL)",
      type: "url",
      description: "Link na vaš Instagram profil",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok (URL)",
      type: "url",
      description: "Link na vaš TikTok profil",
    }),
    defineField({
      name: "websiteUrl",
      title: "Web stranica (URL)",
      type: "url",
      description: "Link na vašu web stranicu",
    }),
    defineField({
      name: "allowWaiterCall",
      title: "Omogući 'Pozovi konobara'",
      type: "boolean",
      initialValue: false,
      description:
        "Ako je uključeno, gosti će u digitalnom meniju vidjeti dugme za poziv konobara.",
    }),
    defineField({
      name: "telegramChatId",
      title: "Telegram Chat ID",
      type: "string",
      description:
        "Chat ID grupe/kanala gdje bot šalje obavijesti o pozivu konobara (npr. -1001234567890).",
    }),
    defineField({
      name: "telegramThreadId",
      title: "Telegram Topic Thread ID (opcionalno)",
      type: "number",
      description:
        "Ako koristite teme u Telegram grupi, upišite thread ID da poruke idu u tačan topic.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
