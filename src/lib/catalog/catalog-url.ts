import {
  FACET_KEYS,
  type CatalogQuery,
  type FacetKey,
} from "@/core/models/catalog-query";

export type CatalogUrlState = CatalogQuery;

function buildParams(state: CatalogUrlState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  for (const key of FACET_KEYS) {
    const values = state[key];
    if (values) for (const value of values) params.append(key, value);
  }
  return params;
}

/** `basePath` may already carry a query string of its own (e.g. the admin
 * panel's `/admin?status=pending`), which is kept in front of the filters. */
function toHref(basePath: string, params: URLSearchParams): string {
  const qs = params.toString();
  if (!qs) return basePath;
  return `${basePath}${basePath.includes("?") ? "&" : "?"}${qs}`;
}

/** Toggles a single value within a facet's selection — adds it if absent,
 * removes it if present — while leaving every other selected value (in
 * this facet and every other one) untouched. This is what allows multiple
 * options to be selected at once within the same facet. */
export function hrefToggleFacet(
  basePath: string,
  state: CatalogUrlState,
  key: FacetKey,
  value: string,
): string {
  const current = state[key] ?? [];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return toHref(
    basePath,
    buildParams({ ...state, [key]: next.length > 0 ? next : undefined }),
  );
}

export function hrefClearAll(basePath: string): string {
  return basePath;
}

/** The current list URL (base path + active filters/search), so a link to
 * an instrument's detail page can carry back exactly what the user had
 * applied when they leave the listing. */
export function currentListHref(
  basePath: string,
  state: CatalogUrlState,
): string {
  return toHref(basePath, buildParams(state));
}

/** True only if `from` is `parentHref` itself or `parentHref` plus a query
 * string — never a different route. Used to validate the `?from=` param on
 * an instrument detail page before using it as the "back" target, so an
 * ad-hoc instrument can't be tricked into linking back to `/` (or anywhere
 * else) via a crafted URL. */
export function isValidListHref(
  from: string | undefined,
  parentHref: string,
): from is string {
  if (!from) return false;
  return from === parentHref || from.startsWith(`${parentHref}?`);
}

export function hasActiveFilters(state: CatalogUrlState): boolean {
  return Boolean(
    state.q || FACET_KEYS.some((key) => (state[key]?.length ?? 0) > 0),
  );
}
