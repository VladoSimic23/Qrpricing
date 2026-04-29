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
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
