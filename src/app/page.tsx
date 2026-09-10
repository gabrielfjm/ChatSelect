import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  FileText,
  Globe2,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tags,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { filterByClassification } from "@/lib/catalog/catalog-service";

export const metadata: Metadata = {
  title: "ChatSelect",
  description:
    "Encontre e compare instrumentos científicos para avaliar chatbots educacionais.",
};

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
      "Busque e filtre por atributo de qualidade, idioma, categoria e modalidade de comunicação.",
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

const METADATA_ITEMS = [
  {
    label: "Atributos de qualidade",
    icon: CheckCircle2,
    tone: "border-cyan-300/20 bg-cyan-300/10 text-cyan-300",
  },
  {
    label: "Modalidade de comunicação",
    icon: MessageSquare,
    tone: "border-violet-300/20 bg-violet-300/10 text-violet-300",
  },
  {
    label: "Idiomas e traduções",
    icon: Globe2,
    tone: "border-emerald-300/20 bg-emerald-300/10 text-emerald-300",
  },
  {
    label: "Evidências de validação",
    icon: BookOpen,
    tone: "border-amber-300/20 bg-amber-300/10 text-amber-300",
  },
  {
    label: "Categoria do instrumento",
    icon: Tags,
    tone: "border-rose-300/20 bg-rose-300/10 text-rose-300",
  },
  {
    label: "Fonte bibliográfica",
    icon: Database,
    tone: "border-blue-300/20 bg-blue-300/10 text-blue-300",
  },
] as const;

const RESEARCH_SIGNALS = [
  "Usabilidade",
  "Aceitação",
  "Satisfação",
  "Engajamento",
  "Qualidade do diálogo",
  "Efetividade pedagógica",
] as const;

export default function HomePage() {
  const all = getAllInstruments();
  const adHocCount = filterByClassification(all, "ad-hoc").length;
  const validatedCount = all.length - adHocCount;

  return (
    <>
      <section className="tech-grid relative isolate overflow-hidden border-b border-cyan-300/10 bg-[radial-gradient(ellipse_70%_55%_at_18%_30%,rgba(14,162,189,0.11),transparent_68%),linear-gradient(145deg,#020818_0%,#050c1a_52%,#06122a_100%)]">
        <div className="hero-aurora hero-aurora-one" aria-hidden="true" />
        <div className="hero-aurora hero-aurora-two" aria-hidden="true" />
        <div className="cyan-line absolute inset-x-0 bottom-0 h-px opacity-60" />
        <Container className="grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-bold tracking-[0.13em] text-cyan-300 uppercase">
              <span className="size-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(30,195,224,0.85)] motion-reduce:animate-none" />
              Seleção baseada em evidências
            </div>

            <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Encontre o instrumento certo para avaliar seu{" "}
              <span className="cyan-text-gradient">chatbot educacional.</span>
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-8 sm:text-lg">
              O ChatSelect transforma evidências dispersas na literatura em um
              catálogo claro e comparável — para você selecionar instrumentos
              com mais agilidade, critério e transparência.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-lg px-6 font-bold shadow-[0_0_28px_rgba(14,162,189,0.24)]"
              >
                <Link href="/instrumentos">
                  Explorar instrumentos
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-lg border-cyan-300/20 bg-white/[0.03] px-6 text-white hover:border-cyan-300/35 hover:bg-cyan-300/10"
              >
                <Link href="#como-funciona">Como funciona</Link>
              </Button>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 divide-x divide-cyan-300/15 border-t border-cyan-300/10 pt-7">
              <div className="pr-4">
                <p className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
                  {all.length}
                </p>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  instrumentos
                </p>
              </div>
              <div className="px-4 sm:px-7">
                <p className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
                  {validatedCount}
                </p>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  validados
                </p>
              </div>
              <div className="pl-4 sm:pl-7">
                <p className="font-serif text-2xl font-extrabold text-white sm:text-3xl">
                  41
                </p>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                  estudos mapeados
                </p>
              </div>
            </div>
          </div>

          <div
            className="relative hidden min-h-[34rem] items-center justify-center lg:flex"
            aria-hidden="true"
          >
            <div className="orbital-ring orbital-ring-three" />
            <div className="orbital-ring orbital-ring-two" />
            <div className="orbital-ring orbital-ring-one" />

            <div className="hero-core relative z-10 flex size-44 flex-col items-center justify-center rounded-full border border-cyan-300/25 bg-[#09182c]/90 text-center shadow-[0_0_70px_rgba(14,162,189,0.22)] backdrop-blur-xl">
              <BrandMark decorative className="mb-3 size-14" />
              <p className="font-serif text-lg font-bold text-white">
                ChatSelect
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                encontre • compare • selecione
              </p>
            </div>

            <div className="floating-card floating-card-one absolute top-[14%] left-[3%] z-20 w-44 rounded-xl border border-cyan-300/20 bg-[#0c1a2e]/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <p className="text-[0.65rem] font-bold tracking-wider text-cyan-300 uppercase">
                Atributo
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Usabilidade
              </p>
            </div>
            <div className="floating-card floating-card-two absolute top-[25%] right-[-2%] z-20 w-44 rounded-xl border border-violet-300/20 bg-[#0c1a2e]/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <p className="text-[0.65rem] font-bold tracking-wider text-violet-300 uppercase">
                Modalidade
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Texto e voz
              </p>
            </div>
            <div className="floating-card floating-card-three absolute right-[10%] bottom-[12%] z-20 w-48 rounded-xl border border-emerald-300/20 bg-[#0c1a2e]/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <p className="text-[0.65rem] font-bold tracking-wider text-emerald-300 uppercase">
                Evidência
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Validação documentada
              </p>
            </div>
            <div className="floating-card floating-card-four absolute bottom-[20%] left-[-1%] z-20 w-40 rounded-xl border border-amber-300/20 bg-[#0c1a2e]/90 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md">
              <p className="text-[0.65rem] font-bold tracking-wider text-amber-300 uppercase">
                Idioma
              </p>
              <p className="mt-1 text-sm font-semibold text-white">Português</p>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="signal-strip overflow-hidden border-b border-cyan-300/10 bg-[#06101f] py-4"
        aria-label="Dimensões encontradas no catálogo"
      >
        <div className="signal-track flex w-max items-center gap-3">
          {[...RESEARCH_SIGNALS, ...RESEARCH_SIGNALS].map((signal, index) => (
            <div
              key={`${signal}-${index}`}
              aria-hidden={index >= RESEARCH_SIGNALS.length}
              className="flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.035] px-4 py-2"
            >
              <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(30,195,224,0.8)]" />
              <span className="text-xs font-semibold tracking-wide text-slate-300 uppercase">
                {signal}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#080f1e] py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
                O desafio
              </p>
              <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                Avaliar bem começa por escolher bem.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="life-card rounded-2xl border border-cyan-300/10 bg-[#0c1a2e] p-6">
                <p className="mb-3 font-serif text-lg font-bold text-white">
                  Informação dispersa
                </p>
                <p className="text-muted-foreground text-sm leading-7">
                  Questionários, escalas, entrevistas e rubricas estão
                  espalhados por diferentes publicações, o que exige tempo para
                  localizar e comparar alternativas.
                </p>
              </div>
              <div className="life-card relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.06] p-6">
                <div className="cyan-line absolute inset-x-0 top-0 h-px" />
                <p className="mb-3 font-serif text-lg font-bold text-white">
                  Decisão estruturada
                </p>
                <p className="text-muted-foreground text-sm leading-7">
                  O ChatSelect reúne metadados comparáveis em um só ambiente e
                  aproxima cada instrumento do contexto real da sua avaliação.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="como-funciona" className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
              Como funciona
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Da pergunta à escolha, em três etapas.
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-7">
              Um fluxo simples para transformar critérios de avaliação em uma
              seleção mais fundamentada.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.number}
                  className="life-card group relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#0c1a2e] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:shadow-[0_14px_40px_rgba(14,162,189,0.09)]"
                >
                  <div className="cyan-line absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="mb-8 flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-serif text-sm font-bold text-cyan-300/45">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-muted-foreground mt-3 text-sm leading-7">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-cyan-300/10 bg-[#080f1e] py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
              Fichas técnicas
            </p>
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
              O essencial para decidir sem voltar ao ponto zero.
            </h2>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-8">
              Cada ficha organiza os principais metadados do instrumento para
              que você compreenda sua finalidade, aplicação e respaldo antes de
              consultar a publicação original.
            </p>
            <Button
              asChild
              variant="link"
              className="mt-5 h-auto px-0 font-bold"
            >
              <Link href="/instrumentos">
                Ver fichas do catálogo
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {METADATA_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="life-card flex items-center gap-4 rounded-xl border border-cyan-300/12 bg-[#0c1a2e] p-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${item.tone}`}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-4 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
              Duas coleções
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Evidência e contexto, sem misturar os critérios.
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <article className="life-card relative overflow-hidden rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.06] p-7 sm:p-8">
              <div className="cyan-line absolute inset-x-0 top-0 h-px" />
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300 uppercase">
                  Coleção principal
                </span>
                <span className="font-serif text-3xl font-extrabold text-white">
                  {validatedCount}
                </span>
              </div>
              <h3 className="text-xl font-bold">Instrumentos validados</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-7">
                Instrumentos com uma fonte psicométrica identificável e
                evidências de validação documentadas na literatura.
              </p>
              <Link
                href="/instrumentos"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200"
              >
                Explorar coleção
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>

            <article className="life-card rounded-2xl border border-cyan-300/12 bg-[#0c1a2e] p-7 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full border border-slate-400/20 bg-slate-400/10 px-3 py-1 text-xs font-bold text-slate-300 uppercase">
                  Coleção contextual
                </span>
                <span className="font-serif text-3xl font-extrabold text-white">
                  {adHocCount}
                </span>
              </div>
              <h3 className="text-xl font-bold">Instrumentos Ad Hoc</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-7">
                Instrumentos criados para um estudo específico, úteis para
                compreender abordagens contextuais ainda sem validação formal.
              </p>
              <Link
                href="/ad-hoc"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200"
              >
                Conhecer coleção
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </Container>
      </section>

      <section className="px-4 pb-20 sm:px-6 sm:pb-24">
        <Container className="tech-grid relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(14,162,189,0.14),transparent_70%),#071225] px-6 py-14 text-center sm:px-12 sm:py-16">
          <Sparkles
            className="mx-auto mb-5 size-7 text-cyan-300"
            aria-hidden="true"
          />
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sua próxima avaliação pode começar com mais evidência.
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-7">
            Explore o catálogo e encontre instrumentos compatíveis com o seu
            objetivo, contexto e público.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-lg px-7 font-bold shadow-[0_0_28px_rgba(14,162,189,0.24)]"
          >
            <Link href="/instrumentos">
              Começar agora
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
