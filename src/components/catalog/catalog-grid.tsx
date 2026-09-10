import { InstrumentCard } from "@/components/catalog/instrument-card";
import type { Instrument } from "@/core/models/instrument";

export function CatalogGrid({
  instruments,
  backHref,
}: {
  instruments: Instrument[];
  backHref?: string;
}) {
  if (instruments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-cyan-300/20 bg-cyan-300/[0.03] p-12 text-center">
        <p className="font-medium">Nenhum instrumento encontrado</p>
        <p className="text-muted-foreground text-sm">
          Tente ajustar os filtros ou o termo de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {instruments.map((instrument) => (
        <InstrumentCard
          key={instrument.slug}
          instrument={instrument}
          backHref={backHref}
        />
      ))}
    </div>
  );
}
