import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SearchBar } from "@/components/catalog/search-bar";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import {
  filterByClassification,
  filterInstruments,
  getFacetOptions,
  sortByTitle,
} from "@/lib/catalog/catalog-service";
import { catalogQueryFromSearchParams } from "@/core/models/catalog-query";
import { currentListHref } from "@/lib/catalog/catalog-url";

export const metadata: Metadata = {
  title: "Ad Hoc",
  description:
    "Instrumentos Ad Hoc: questionários criados pelos próprios autores dos estudos, sem derivar de uma fonte psicométrica validada.",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function AdHocPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = catalogQueryFromSearchParams(await searchParams);

  const adHoc = filterByClassification(getAllInstruments(), "ad-hoc");
  const facetOptions = getFacetOptions(adHoc);
  const filtered = sortByTitle(filterInstruments(adHoc, query));

  return (
    <Container className="space-y-8 py-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            Instrumentos não validados
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Ad Hoc</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Os instrumentos Ad Hoc são questionários, escalas ou roteiros
            criados pelos próprios autores de um estudo especificamente para
            aquela pesquisa, sem derivar de uma fonte psicométrica validada e
            citável. Isso significa que, na maioria dos casos, não há dados
            formais de confiabilidade (como Alfa de Cronbach) ou validação
            prévia disponíveis para esses instrumentos — eles foram construídos
            sob medida para responder às necessidades do estudo específico em
            que foram aplicados.
          </p>
        </div>
        <SearchBar action="/ad-hoc" state={query} />
        <p className="text-muted-foreground text-sm">
          {filtered.length}{" "}
          {filtered.length === 1
            ? "instrumento encontrado"
            : "instrumentos encontrados"}
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          basePath="/ad-hoc"
          state={query}
          facetOptions={facetOptions}
        />
        <CatalogGrid
          instruments={filtered}
          backHref={currentListHref("/ad-hoc", query)}
        />
      </div>
    </Container>
  );
}
