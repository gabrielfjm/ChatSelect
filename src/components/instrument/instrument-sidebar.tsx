import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CatalogBackLink,
  CatalogBackLinkFallback,
} from "@/components/catalog/catalog-back-link";
import { cn } from "@/lib/utils";
import { categorySolidClasses } from "@/lib/catalog/category-colors";
import type { Instrument } from "@/core/models/instrument";

function SidebarField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase">
        {label}
      </dt>
      <dd className="text-sm text-white">{value}</dd>
    </div>
  );
}

/** Dark side panel for the instrument's identifying metadata. The back link
 * is hydrated separately so static exports can still preserve list filters. */
export function InstrumentSidebar({
  instrument,
  parentHref,
  parentLabel,
}: {
  instrument: Instrument;
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <aside className="tech-grid space-y-6 border-r border-cyan-300/10 bg-[#071225] px-6 py-8 sm:px-8">
      <Suspense
        fallback={
          <CatalogBackLinkFallback
            parentHref={parentHref}
            parentLabel={parentLabel}
          />
        }
      >
        <CatalogBackLink parentHref={parentHref} parentLabel={parentLabel} />
      </Suspense>

      <div className="space-y-3">
        <Badge className="border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
          {instrument.sheetName}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {instrument.title}
        </h1>
        {instrument.description && (
          <p className="text-sm text-slate-400">{instrument.description}</p>
        )}
      </div>

      <dl className="space-y-4">
        <SidebarField label="Autores" value={instrument.authors} />
        {instrument.category && (
          <div>
            <dt className="mb-1 text-xs font-medium tracking-wide text-slate-400 uppercase">
              Categoria
            </dt>
            <dd>
              <Badge
                className={cn(
                  "rounded-full",
                  categorySolidClasses(instrument.category),
                )}
              >
                {instrument.category}
              </Badge>
            </dd>
          </div>
        )}
        <SidebarField
          label="Idioma original"
          value={instrument.originalLanguage}
        />
        <SidebarField label="Traduções" value={instrument.translations} />
      </dl>
    </aside>
  );
}
