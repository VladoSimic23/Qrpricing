import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("tenant").title("Tenanti"),
      S.documentTypeListItem("tenantMember").title("Tenant korisnici"),
      S.divider(),
      S.documentTypeListItem("menuCategory").title("Kategorije menija"),
      S.documentTypeListItem("menuItem").title("Artikli menija"),
    ]);
