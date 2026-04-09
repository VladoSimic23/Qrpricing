import { defineField, defineType } from "sanity";

export const tenantMemberType = defineType({
  name: "tenantMember",
  title: "Tenant Member",
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
      name: "clerkUserId",
      title: "Clerk user ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Uloga",
      type: "string",
      options: {
        list: [
          { title: "Owner", value: "owner" },
          { title: "Editor", value: "editor" },
        ],
      },
      initialValue: "owner",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "tenant.name",
      role: "role",
    },
    prepare({ title, subtitle, role }) {
      return {
        title: title || "Bez emaila",
        subtitle: `${subtitle || "Bez tenanta"} | ${role || "member"}`,
      };
    },
  },
});
