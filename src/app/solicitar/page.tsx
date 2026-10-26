import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { RequestInstrumentForm } from "@/components/request/request-instrument-form";

export const metadata: Metadata = {
  title: "Solicitar instrumento",
  description:
    "Sugira a inclusão de um novo instrumento de avaliação no catálogo.",
};

export default function RequestInstrumentPage() {
  return (
    <Container className="max-w-xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Solicitar instrumento
        </h1>
        <p className="text-muted-foreground text-sm">
          Conhece um instrumento de avaliação (validado ou ad hoc) usado em
          pesquisas sobre chatbots educacionais que ainda não está no nosso
          catálogo? Preencha o formulário abaixo. Sua sugestão será revisada por
          nossa equipe antes de ser adicionada. Se informar seu e-mail, você
          recebe um retorno sobre o status.
        </p>
      </div>

      <RequestInstrumentForm />
    </Container>
  );
}
