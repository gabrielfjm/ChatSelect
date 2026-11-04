import type { Instrument } from "@/core/models/instrument";

/** Fact-sheet row: label on the left, value on the right, one field per
 * line. A rigid multi-column grid put a one-line field (e.g. "Idioma
 * Original: Alemão") next to a six-line one (e.g. "Formato de resposta"),
 * leaving ragged whitespace — this stacks instead, so every field takes
 * only the height it needs. Autores, Idioma original, Traduções and
 * Foco da avaliação live in the dark side panel (InstrumentSidebar) instead. */
function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-6">
      <dt className="text-muted-foreground w-full shrink-0 text-xs font-medium tracking-wide uppercase sm:w-52">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export function InstrumentMeta({ instrument }: { instrument: Instrument }) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold">Detalhes técnicos</h2>
      <dl className="divide-y">
        <MetaItem
          label="Amostra de validação do instrumento"
          value={instrument.originalSample}
        />
        <MetaItem
          label="Tipo de instrumento"
          value={instrument.instrumentType}
        />
        <MetaItem label="Número de itens" value={instrument.itemCount} />
        <MetaItem
          label="Formato de resposta"
          value={instrument.responseFormat}
        />
        <MetaItem
          label="Modalidades de comunicação"
          value={instrument.communicationModalities}
        />
        <MetaItem
          label="Perspectiva de qualidade"
          value={instrument.qualityAttributes}
        />
        <MetaItem label="Atributo de qualidade" value={instrument.attributes} />
        {instrument.instrumentLink && (
          <MetaItem
            label="Link do instrumento"
            value={
              <a
                href={instrument.instrumentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover break-all hover:underline"
              >
                {instrument.instrumentLink}
              </a>
            }
          />
        )}
      </dl>
    </section>
  );
}
