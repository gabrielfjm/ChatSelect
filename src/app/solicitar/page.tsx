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
    <>
      <section className="tech-grid border-b border-cyan-300/10 bg-[radial-gradient(ellipse_50%_100%_at_15%_50%,rgba(14,162,189,0.1),transparent_72%),#071225]">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
            Catálogo colaborativo
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sugerir um instrumento
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            Conhece um instrumento usado na avaliação de chatbots educacionais
            que ainda não está no catálogo? Compartilhe a referência com a nossa
            equipe.
          </p>
        </Container>
      </section>

      <Container className="max-w-2xl py-10 sm:py-14">
        <div className="rounded-2xl border border-cyan-300/15 bg-[#0a172a] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-8">
          <p className="text-muted-foreground mb-7 text-sm leading-7">
            A sugestão será revisada antes de entrar no catálogo. Se informar
            seu e-mail, você poderá receber um retorno sobre o status.
          </p>
          <RequestInstrumentForm />
        </div>
      </Container>
    </>
  );
}
