import { defineField, defineType } from "sanity";

export const menuSubcategoryType = defineType({
  name: "menuSubcategory",
  title: "Menu Subcategory",
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
      name: "title",
      title: "Naziv podkategorije",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "titleEn",
      title: "Naziv podkategorije (EN)",
      type: "string",
    }),
    defineField({
      name: "sortOrder",
      title: "Redoslijed",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ?? "Bez kategorije",
      };
    },
  },
});
