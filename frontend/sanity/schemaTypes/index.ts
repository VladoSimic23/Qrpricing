import { type SchemaTypeDefinition } from "sanity";
import { menuCategoryType } from "./menuCategoryType";
import { menuItemType } from "./menuItemType";
import { menuSubcategoryType } from "./menuSubcategoryType";
import { tenantMemberType } from "./tenantMemberType";
import { tenantType } from "./tenantType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    tenantType,
    tenantMemberType,
    menuCategoryType,
    menuSubcategoryType,
    menuItemType,
  ],
};
