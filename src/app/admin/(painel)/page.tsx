import Link from "next/link";
import { Plus } from "lucide-react";
import {
  INSTRUMENT_STATUSES,
  type Instrument,
  type InstrumentStatus,
} from "@/core/models/instrument";
import { catalogQueryFromSearchParams } from "@/core/models/catalog-query";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/catalog/search-bar";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { STATUS_LABELS, StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/auth/admin";
import {
  countByStatus,
  listInstrumentRecords,
} from "@/lib/catalog/instruments-repository";
import {
  filterByClassification,
  filterInstruments,
  getFacetOptions,
} from "@/lib/catalog/catalog-service";
import {
  currentListHref,
  hasActiveFilters,
} from "@/lib/catalog/catalog-url";
import { cn } from "@/lib/utils";

const TAB_LABELS: Record<InstrumentStatus, string> = {
  pending: "Solicitações pendentes",
  approved: "Publicados",
  rejected: "Rejeitados",
};

const CLASSIFICATION_OPTIONS = [
  { value: null, label: "Todos" },
  { value: "adapted", label: "Validados" },
  { value: "ad-hoc", label: "Ad hoc" },
] as const;

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

type RawSearchParams = Record<string, string | string[] | undefined>;

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const counts = await countByStatus();

  const requested = typeof params.status === "string" ? params.status : null;
  const status: InstrumentStatus = INSTRUMENT_STATUSES.includes(
    requested as InstrumentStatus,
  )
    ? (requested as InstrumentStatus)
    : counts.pending > 0
      ? "pending"
      : "approved";
  const classification: Instrument["classification"] | null =
    params.tipo === "adapted" || params.tipo === "ad-hoc" ? params.tipo : null;

  // Same search + facet filters as the public catalog, applied to the
  // records of the current status tab (and classification, if chosen).
  const query = catalogQueryFromSearchParams(params);
  const inTab = await listInstrumentRecords(status);
  const scoped = classification
    ? filterByClassification(inTab, classification)
    : inTab;
  const facetOptions = getFacetOptions(scoped);
  const records = filterInstruments(scoped, query);

  // Base for every filter link: keeps the tab and classification while the
  // shared catalog components add/remove facets after it.
  const baseParams = new URLSearchParams({ status });
  if (classification) baseParams.set("tipo", classification);
  const basePath = `/admin?${baseParams}`;
  const filtering = hasActiveFilters(query) || classification !== null;

  return (
    <Container className="space-y-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Instrumentos</h1>
          <p className="text-muted-foreground text-sm">
            Revise as solicitações enviadas pelo site e gerencie as fichas
            publicadas. Só fichas com status “Publicado” aparecem no catálogo.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/instrumentos/novo">
            <Plus aria-hidden="true" />
            Novo instrumento
          </Link>
        </Button>
      </div>

      {params.excluido === "1" && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          Instrumento excluído.
        </p>
      )}

      <nav aria-label="Status" className="flex flex-wrap gap-2 border-b">
        {INSTRUMENT_STATUSES.map((tab) => (
          <Link
            key={tab}
            href={`/admin?status=${tab}`}
            aria-current={tab === status ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
              tab === status
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {TAB_LABELS[tab]}
            <span
              className={cn(
                "ml-2 rounded-full px-2 py-0.5 text-xs",
                tab === "pending" && counts.pending > 0
                  ? "bg-amber-100 text-amber-900"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {counts[tab]}
            </span>
          </Link>
        ))}
      </nav>

      <div className="space-y-4">
        <SearchBar
          action="/admin"
          state={query}
          hiddenFields={Object.fromEntries(baseParams)}
          placeholder="Buscar por título, sigla, autor ou descrição..."
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Classificação"
            className="bg-background inline-flex rounded-lg border p-1"
          >
            {CLASSIFICATION_OPTIONS.map((option) => {
              // Switching classification keeps the search and facets.
              const base = new URLSearchParams({ status });
              if (option.value) base.set("tipo", option.value);
              const active = classification === option.value;
              return (
                <Link
                  key={option.label}
                  href={currentListHref(`/admin?${base}`, query)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
          <p className="text-muted-foreground text-sm">
            {records.length}{" "}
            {records.length === 1
              ? "instrumento encontrado"
              : "instrumentos encontrados"}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          basePath={basePath}
          state={query}
          facetOptions={facetOptions}
        />

        {records.length === 0 ? (
          <Card className="text-muted-foreground p-8 text-center text-sm">
            {filtering
              ? "Nenhum instrumento encontrado com esses filtros."
              : `Nenhum instrumento com status “${STATUS_LABELS[status]}”.`}
          </Card>
        ) : (
          <Card className="divide-y overflow-hidden p-0">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/admin/instrumentos/${record.id}`}
                className="hover:bg-accent flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium">{record.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {record.sheetName} ·{" "}
                    {record.classification === "ad-hoc" ? "Ad hoc" : "Validado"}
                    {record.category ? ` · ${record.category}` : ""}
                  </p>
                </div>
                <div className="text-muted-foreground flex shrink-0 items-center gap-3 text-xs">
                  {status !== "approved" && (
                    <span>
                      {record.submitterName ??
                        record.submitterEmail ??
                        (record.reviewedBy
                          ? "Criado pelo admin"
                          : "Anônimo")}{" "}
                      · {dateFormat.format(new Date(record.createdAt))}
                    </span>
                  )}
                  <StatusBadge status={record.status} />
                </div>
              </Link>
            ))}
          </Card>
        )}
      </div>
    </Container>
  );
}
