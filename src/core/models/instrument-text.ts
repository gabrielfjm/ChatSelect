/**
 * Text helpers shared by the CSV seed script and the instrument forms, so a
 * ficha gets the same slug / dual-application flag no matter whether it was
 * imported from the spreadsheet or typed into the site.
 */

export function slugify(sheetName: string): string {
  return sheetName
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Instruments applied twice in the source study describe both
 * applications ("Aplicação 1" / "Aplicação 2") in their description. */
export function detectDualApplication(
  instrumentDescription: string | null | undefined,
): boolean {
  const text = instrumentDescription ?? "";
  return /aplicaç[ãa]o 1/i.test(text) && /aplicaç[ãa]o 2/i.test(text);
}
