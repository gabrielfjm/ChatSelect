"use client";

import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SearchBar } from "@/components/catalog/search-bar";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { catalogQueryFromSearchParams } from "@/core/models/catalog-query";
import type { Instrument } from "@/core/models/instrument";
import {
  filterInstruments,
  getFacetOptions,
  sortByTitle,
} from "@/lib/catalog/catalog-service";
import { currentListHref } from "@/lib/catalog/catalog-url";

type RawSearchParams = Record<string, string | string[] | undefined>;

function toRawSearchParams(searchParams: URLSearchParams): RawSearchParams {
  const raw: RawSearchParams = {};

  searchParams.forEach((value, key) => {
    const current = raw[key];
    if (current === undefined) {
      raw[key] = value;
    } else if (Array.isArray(current)) {
      current.push(value);
    } else {
      raw[key] = [current, value];
    }
  });

  return raw;
}

export function CatalogBrowser({
  basePath,
  instruments,
}: {
  basePath: "/instrumentos" | "/ad-hoc";
  instruments: Instrument[];
}) {
  const searchParams = useSearchParams();
  const query = catalogQueryFromSearchParams(toRawSearchParams(searchParams));
  const facetOptions = getFacetOptions(instruments);
  const filtered = sortByTitle(filterInstruments(instruments, query));

  return (
    <Container className="grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
      <FilterSidebar
        basePath={basePath}
        state={query}
        facetOptions={facetOptions}
      />
      <div className="flex flex-col gap-6">
        <SearchBar action={basePath} state={query} />
        <p className="text-muted-foreground text-sm">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "instrumento encontrado"
            : "instrumentos encontrados"}
        </p>
        <CatalogGrid
          instruments={filtered}
          backHref={currentListHref(basePath, query)}
        />
      </div>
    </Container>
  );
}
