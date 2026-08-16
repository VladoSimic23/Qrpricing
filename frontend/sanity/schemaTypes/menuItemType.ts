import { defineArrayMember, defineField, defineType } from "sanity";

export const menuItemType = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    defineField({
      name: "tenant",
      title: "Tenant",
      type: "reference",
      to: [{ type: "tenant" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategorija",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Naziv artikla",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "nameEn",
      title: "Naziv artikla (EN)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descriptionEn",
      title: "Opis (EN)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Cijena",
      type: "number",
      description: "Koristi se ako artikl nema definirane veličine ispod.",
      validation: (rule) =>
        rule.min(0).custom((value, context) => {
          const document = context.document as
            | { sizeVariants?: unknown[] }
            | undefined;
          const hasVariants = (document?.sizeVariants?.length ?? 0) > 0;
          if (!hasVariants && (value === undefined || value === null)) {
            return "Cijena je obavezna ako artikl nema definirane veličine.";
          }
          return true;
        }),
    }),
    defineField({
      name: "sizeVariants",
      title: "Veličine i cijene",
      description:
        "Dodaj ako artikl ima više veličina (npr. Mala/Velika) s različitim cijenama. Ako je popunjeno, koristi se umjesto cijene iznad.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "sizeVariant",
          fields: [
            defineField({
              name: "label",
              title: "Naziv veličine",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Cijena",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { label: "label", price: "price" },
            prepare({ label, price }) {
              return { title: `${label}: ${price ?? 0}` };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "currency",
      title: "Valuta",
      type: "string",
      initialValue: "EUR",
      options: {
        list: [
          { title: "EUR", value: "EUR" },
          { title: "KM", value: "BAM" },
        ],
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value === undefined) return true;
          return value === "EUR" || value === "BAM"
            ? true
            : "Valuta mora biti EUR ili KM.";
        }),
    }),
    defineField({
      name: "isAvailable",
      title: "Dostupno",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Redoslijed",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Slika",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "subCategory",
      title: "Podkategorija",
      type: "reference",
      to: [{ type: "menuSubcategory" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      price: "price",
      currency: "currency",
    },
    prepare({ title, subtitle, price, currency }) {
      return {
        title,
        subtitle: `${subtitle || "Bez kategorije"} | ${price ?? 0} ${currency || "EUR"}`,
      };
    },
  },
});
