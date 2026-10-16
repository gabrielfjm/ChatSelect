import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { filterByClassification } from "@/lib/catalog/catalog-service";

export const metadata: Metadata = {
  // Set as a full literal string rather than relying on the root layout's
  // title template ("%s | ChatSelect") — on this Next.js version the
  // template silently doesn't apply to the root "/" route specifically
  // (verified: every other route applies it correctly), which left the
  // browser tab reading bare "Instrumentos" with no "ChatSelect" in sight.
  title: "ChatSelect",
  description:
    "Catálogo de instrumentos para avaliação de chatbots educacionais.",
};

const CHALLENGE_CARDS = [
  {
    title: "Informação dispersa",
    text: "Questionários, escalas, entrevistas e rubricas estão espalhados por diferentes publicações, o que exige tempo para localizar e comparar alternativas.",
  },
  {
    title: "Decisão estruturada",
    text: "O ChatSelect reúne metadados comparáveis em um só ambiente e aproxima cada instrumento do contexto real da sua avaliação.",
  },
] as const;

const PROCESS_STEPS = [
  {
    number: "01",
    title: "Defina o que avaliar",
    description:
      "Parta do seu objetivo: usabilidade, satisfação, aceitação, engajamento ou outra dimensão.",
    icon: SlidersHorizontal,
  },
  {
    number: "02",
    title: "Refine as alternativas",
    description:
      "Busque e filtre por categoria, idioma, modalidade de comunicação, atributos e atributos de qualidade.",
    icon: Search,
  },
  {
    number: "03",
    title: "Analise a ficha técnica",
    description:
      "Compare descrição, aplicação, pontuação, confiabilidade, vantagens, limitações e fonte.",
    icon: FileText,
  },
] as const;

export default async function HomePage() {
  const all = await getAllInstruments();
  const adHocCount = filterByClassification(all, "ad-hoc").length;
  const validatedCount = all.length - adHocCount;

  return (
    <>
      <section className="bg-[#0F172A] py-20">
        <Container className="max-w-3xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Encontre o instrumento certo para avaliar seu chatbot educacional.
          </h1>
          <p className="mx-auto max-w-2xl text-base text-blue-200 sm:text-lg">
            O ChatSelect transforma evidências dispersas na literatura em um
            catálogo claro e comparável — para você selecionar instrumentos com
            mais agilidade, critério e transparência.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/instrumentos">Explorar catálogo</Link>
          </Button>
        </Container>
      </section>

      {/* "O Desafio" — texto do Gabriel, componentes do tema claro */}
      <section className="bg-background py-16">
        <Container className="space-y-10">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              O desafio
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Avaliar bem começa por escolher bem.
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {CHALLENGE_CARDS.map((card) => (
              <Card key={card.title}>
                <CardContent className="pt-6">
                  <p className="mb-2 font-serif text-lg font-bold">
                    {card.title}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* "Como Funciona" — texto do Gabriel, componentes do tema claro */}
      <section id="como-funciona" className="bg-accent py-16">
        <Container className="space-y-10">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              Como funciona
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Da pergunta à escolha, em três etapas.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Um fluxo simples para transformar critérios de avaliação em uma
              seleção mais fundamentada.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number}>
                  <CardContent className="pt-6">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="bg-secondary text-primary flex size-11 items-center justify-center rounded-xl">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-serif text-sm font-bold text-slate-300">
                        {step.number}
                      </span>
                    </div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* "Duas Coleções" — texto do Gabriel, componentes do tema claro */}
      <section className="bg-background py-16">
        <Container className="space-y-10">
          <div className="mx-auto max-w-2xl space-y-2 text-center">
            <p className="text-primary text-xs font-semibold tracking-wide uppercase">
              Duas coleções
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Evidência e contexto, sem misturar os critérios.
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-bold uppercase">
                    Coleção principal
                  </span>
                  <span className="font-serif text-2xl font-bold">
                    {validatedCount}
                  </span>
                </div>
                <p className="text-lg font-bold">Instrumentos validados</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Instrumentos com uma fonte psicométrica identificável e
                  evidências de validação documentadas na literatura.
                </p>
                <Link
                  href="/instrumentos"
                  className="text-primary hover:text-primary-hover mt-4 inline-flex items-center gap-1.5 text-sm font-bold"
                >
                  Explorar coleção
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-bold uppercase">
                    Coleção contextual
                  </span>
                  <span className="font-serif text-2xl font-bold">
                    {adHocCount}
                  </span>
                </div>
                <p className="text-lg font-bold">Instrumentos Ad Hoc</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Instrumentos criados para um estudo específico, úteis para
                  compreender abordagens contextuais ainda sem validação formal.
                </p>
                <Link
                  href="/ad-hoc"
                  className="text-primary hover:text-primary-hover mt-4 inline-flex items-center gap-1.5 text-sm font-bold"
                >
                  Conhecer coleção
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
