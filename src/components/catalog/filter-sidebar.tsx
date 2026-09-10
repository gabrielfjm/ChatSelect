import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FACET_KEYS, type FacetKey } from "@/core/models/catalog-query";
import {
  hrefClearAll,
  hrefToggleFacet,
  type CatalogUrlState,
} from "@/lib/catalog/catalog-url";
import { categorySolidClasses } from "@/lib/catalog/category-colors";

const FACET_LABELS: Record<FacetKey, string> = {
  category: "Categoria",
  originalLanguage: "Idioma",
  communicationModality: "Modalidade de comunicação",
  attribute: "Atributos",
  qualityAttribute: "Atributos de qualidade",
};

function ToggleOption({
  href,
  active,
  label,
  solidClasses,
}: {
  href: string;
  active: boolean;
  label: string;
  /** Border+fill classes applied when checked; defaults to primary blue. */
  solidClasses?: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={active}
      className={cn(
        "hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active && "bg-accent font-medium",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "border-input flex size-4 shrink-0 items-center justify-center rounded-sm border-2 transition-colors",
          active
            ? (solidClasses ??
                "border-primary bg-primary text-primary-foreground")
            : "hover:border-primary",
        )}
      >
        {active && <Check className="size-3" />}
      </span>
      {label}
    </Link>
  );
}

export function FilterSidebar({
  basePath,
  state,
  facetOptions,
}: {
  basePath: string;
  state: CatalogUrlState;
  facetOptions: Record<FacetKey, string[]>;
}) {
  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Filtros
        </h2>
        <Link
          href={hrefClearAll(basePath)}
          scroll={false}
          className="text-primary hover:text-primary-hover text-xs hover:underline"
        >
          Limpar
        </Link>
      </div>
      {FACET_KEYS.map((key) => {
        const options = facetOptions[key];
        if (options.length === 0) return null;
        return (
          <Card key={key} className="border-cyan-300/12 bg-[#0a172a]">
            <CardHeader>
              <CardTitle className="text-sm">{FACET_LABELS[key]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0">
              {options.map((option) => {
                const active = (state[key] ?? []).includes(option);
                return (
                  <ToggleOption
                    key={option}
                    href={hrefToggleFacet(basePath, state, key, option)}
                    active={active}
                    label={option}
                    solidClasses={
                      key === "category"
                        ? categorySolidClasses(option)
                        : undefined
                    }
                  />
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </aside>
  );
}
