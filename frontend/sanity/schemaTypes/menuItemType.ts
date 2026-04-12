import { defineField, defineType } from "sanity";

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
      validation: (rule) => rule.required().min(0),
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
