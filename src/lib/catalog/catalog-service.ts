import type { Instrument } from "@/core/models/instrument";
import {
  FACET_KEYS,
  type CatalogQuery,
  type FacetKey,
} from "@/core/models/catalog-query";

/**
 * Pure functions over an `Instrument[]` — no data-source dependency, so
 * tests can pass small fixture arrays directly instead of mocking a module.
 */

export type CatalogFilters = CatalogQuery;

/** Maps each URL-facing facet key to the Instrument field it filters on. */
const FACET_FIELD_MAP: Record<FacetKey, keyof Instrument> = {
  category: "category",
  originalLanguage: "originalLanguage",
  communicationModality: "communicationModalities",
  attribute: "attributes",
  qualityAttribute: "qualityAttributes",
};

/** Splits a comma-separated multi-value field (e.g. "Adequação Funcional,
 * Usabilidade") into trimmed individual values. Fields with no comma just
 * split into a one-element array, so this is safe to apply uniformly
 * across every facet, including single-valued ones. */
function splitMultiValue(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function matchesQuery(instrument: Instrument, q: string): boolean {
  const needle = q.toLowerCase();
  const haystack = [
    instrument.title,
    instrument.sheetName,
    instrument.authors,
    instrument.description,
    instrument.instrumentDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterInstruments<T extends Instrument>(
  instruments: T[],
  filters: CatalogFilters,
): T[] {
  return instruments.filter((instrument) => {
    if (filters.q && !matchesQuery(instrument, filters.q)) return false;
    for (const key of FACET_KEYS) {
      const filterValues = filters[key];
      if (!filterValues || filterValues.length === 0) continue;
      const rawValue = instrument[FACET_FIELD_MAP[key]];
      const instrumentValues =
        typeof rawValue === "string" ? splitMultiValue(rawValue) : [];
      // Multiple selected values within one facet are OR'd (e.g. category
      // "A" or "B"); different facets are still AND'd together.
      const matchesAny = filterValues.some((value) =>
        instrumentValues.includes(value),
      );
      if (!matchesAny) return false;
    }
    return true;
  });
}

export function sortByTitle<T extends Instrument>(instruments: T[]): T[] {
  return [...instruments].sort((a, b) =>
    a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function findInstrumentBySlug(
  instruments: Instrument[],
  slug: string,
): Instrument | undefined {
  return instruments.find((instrument) => instrument.slug === slug);
}

export function filterByClassification<T extends Instrument>(
  instruments: T[],
  classification: Instrument["classification"],
): T[] {
  return instruments.filter(
    (instrument) => instrument.classification === classification,
  );
}

/** Unique, sorted, non-null values of a given Instrument field — used to
 * build filter option lists from whatever subset of instruments is
 * currently in scope (e.g. adapted-only on the home page). Comma-separated
 * multi-value fields (e.g. "Adequação Funcional, Usabilidade") are split so
 * each individual value becomes its own option instead of one combined
 * option per unique string. */
export function getUniqueValues(
  instruments: Instrument[],
  field: keyof Instrument,
): string[] {
  const set = new Set<string>();
  for (const instrument of instruments) {
    const value = instrument[field];
    if (typeof value === "string" && value) {
      for (const part of splitMultiValue(value)) set.add(part);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/** Builds the option lists for every facet filter from the given
 * instruments (should be the same subset shown by the page, so no filter
 * option ever leads to a dead-end zero-result state). */
export function getFacetOptions(
  instruments: Instrument[],
): Record<FacetKey, string[]> {
  const result = {} as Record<FacetKey, string[]>;
  for (const key of FACET_KEYS) {
    result[key] = getUniqueValues(instruments, FACET_FIELD_MAP[key]);
  }
  return result;
}

/** Fields whose form inputs suggest the values already in the catalog, so
 * a new ficha reuses "Usabilidade" instead of creating a near-duplicate
 * "usabilidade" filter option. */
const SUGGESTED_FIELDS = [
  "instrumentType",
  "category",
  "qualityAttributes",
  "attributes",
  "communicationModalities",
  "originalLanguage",
] as const satisfies readonly (keyof Instrument)[];

export function getFieldSuggestions(
  instruments: Instrument[],
): Record<(typeof SUGGESTED_FIELDS)[number], string[]> {
  const result = {} as Record<(typeof SUGGESTED_FIELDS)[number], string[]>;
  for (const field of SUGGESTED_FIELDS) {
    result[field] = getUniqueValues(instruments, field);
  }
  return result;
}
