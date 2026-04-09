import { defineField, defineType } from "sanity";

export const menuCategoryType = defineType({
  name: "menuCategory",
  title: "Menu Category",
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
      name: "title",
      title: "Naziv kategorije",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "sortOrder",
      title: "Redoslijed",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "tenant.name" },
  },
});
