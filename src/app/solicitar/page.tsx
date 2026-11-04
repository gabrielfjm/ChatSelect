import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { RequestInstrumentForm } from "@/components/request/request-instrument-form";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { getFieldSuggestions } from "@/lib/catalog/catalog-service";

export const metadata: Metadata = {
  title: "Solicitar instrumento",
  description:
    "Sugira a inclusão de um novo instrumento de avaliação no catálogo.",
};

export default async function RequestInstrumentPage() {
  const suggestions = getFieldSuggestions(await getAllInstruments());

  return (
    <Container className="max-w-2xl space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Solicitar instrumento
        </h1>
        <p className="text-muted-foreground text-sm">
          Conhece um instrumento de avaliação (validado ou ad hoc) usado em
          pesquisas sobre chatbots educacionais que ainda não está no nosso
          catálogo? Preencha a ficha abaixo com o que souber — só o nome e a
          descrição são obrigatórios. A equipe revisa, completa e, se aprovada,
          a ficha passa a aparecer no catálogo.
        </p>
      </div>

      <RequestInstrumentForm suggestions={suggestions} />
    </Container>
  );
}
