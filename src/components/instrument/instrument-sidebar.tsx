import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

/** Dark fixed-style side panel replacing the old rigid 3-column meta grid
 * for short/identifying fields (title, authors, category, language,
 * translations) — the "← Voltar" link lives here too, carrying whatever
 * filters/search were active on the listing (see isValidListHref in
 * catalog-url.ts) so returning to the list doesn't reset them. */
export function InstrumentSidebar({
  instrument,
  backHref,
  parentLabel,
}: {
  instrument: Instrument;
  backHref: string;
  parentLabel: string;
}) {
  return (
    <aside className="space-y-6 bg-[#0F172A] px-6 py-8 sm:px-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white"
      >
        &larr; Voltar ao {parentLabel}
      </Link>

      <div className="space-y-3">
        <Badge className="border-transparent bg-white/10 text-slate-300">
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
              Foco da avaliação
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
