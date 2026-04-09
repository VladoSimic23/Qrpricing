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
      name: "slug",
      title: "Public slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
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
