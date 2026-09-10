import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Database, Mail, Search, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a pesquisa e a equipe por trás do ChatSelect.",
};

const TEAM = [
  {
    name: "Mariana Almeida Faustino",
    institution: "UTFPR",
    email: "marianafaustino@alunos.utfpr.edu.br",
    orcid: "0009-0006-2436-2526",
  },
  {
    name: "Gabriel Felipe Jess Meira",
    institution: "PUCPR",
    email: "gabrielfjmeira@gmail.com",
    orcid: null,
  },
  {
    name: "Silvana Morita Melo",
    institution: "UFGD",
    email: "silvanamelo@ufgd.edu.br",
    orcid: null,
  },
  {
    name: "Leo Natan Paschoal",
    institution: "PUCPR",
    email: "leo.paschoal@pucpr.edu.br",
    orcid: "0000-0003-1076-9174",
  },
  {
    name: "Pedro Henrique Dias Valle",
    institution: "USP",
    email: "pedrohenriquevalle@usp.br",
    orcid: "0000-0002-6929-7557",
  },
] as const;

const RESEARCH_PILLARS = [
  {
    icon: BookOpen,
    title: "Base científica",
    text: "O catálogo parte de um mapeamento sistemático da literatura sobre instrumentos e artefatos usados na avaliação de chatbots educacionais.",
  },
  {
    icon: Database,
    title: "Metadados estruturados",
    text: "As fichas organizam descrição, atributos de qualidade, modalidade, idioma, aplicação, confiabilidade e fonte bibliográfica.",
  },
  {
    icon: Search,
    title: "Seleção apoiada",
    text: "Busca e filtros reduzem o esforço de localizar alternativas e tornam a comparação mais sistemática, transparente e fundamentada.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="tech-grid border-b border-cyan-300/10 bg-[radial-gradient(ellipse_50%_100%_at_15%_50%,rgba(14,162,189,0.1),transparent_72%),#071225]">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
            Pesquisa aplicada
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sobre o ChatSelect
          </h1>
          <p className="text-muted-foreground mt-4 max-w-3xl text-sm leading-7 sm:text-base">
            Uma ferramenta web criada para apoiar pesquisadores na escolha de
            instrumentos adequados à avaliação de chatbots educacionais.
          </p>
        </Container>
      </section>

      <Container className="space-y-20 py-12 sm:py-16">
        <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
              Motivação
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Menos tempo procurando. Mais critério escolhendo.
            </h2>
          </div>
          <div className="text-muted-foreground space-y-4 text-sm leading-7 sm:text-base sm:leading-8">
            <p>
              A avaliação de chatbots educacionais envolve dimensões técnicas,
              pedagógicas e de experiência do usuário. Apesar da variedade de
              questionários, escalas, entrevistas e rubricas disponível, as
              informações necessárias para escolher entre eles permanecem
              distribuídas por diferentes publicações.
            </p>
            <p>
              O ChatSelect centraliza esse conhecimento em fichas comparáveis.
              Assim, pesquisadores podem identificar alternativas compatíveis
              com seus objetivos, consultar evidências de validação e acessar a
              fonte original de cada instrumento.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {RESEARCH_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#0c1a2e] p-6"
              >
                <div className="cyan-line absolute inset-x-0 top-0 h-px opacity-70" />
                <span className="mb-5 flex size-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold">{pillar.title}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-7">
                  {pillar.text}
                </p>
              </article>
            );
          })}
        </section>

        <section>
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
                Autoria
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Equipe de pesquisa
              </h2>
            </div>
            <a
              href={withBasePath("/assets/artigo-chatselect.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-cyan-300 hover:text-cyan-200"
            >
              Ler o artigo completo →
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TEAM.map((person) => (
              <article
                key={person.name}
                className="rounded-2xl border border-cyan-300/12 bg-[#0a172a] p-5 text-center"
              >
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
                  <User className="size-7 text-cyan-300" aria-hidden="true" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm leading-5 font-bold">{person.name}</h3>
                  <p className="text-muted-foreground mt-1 text-xs font-semibold">
                    {person.institution}
                  </p>
                </div>
                <div className="mt-4 space-y-1.5">
                  <a
                    href={`mailto:${person.email}`}
                    aria-label={`Enviar e-mail para ${person.name}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    <Mail className="size-3.5" aria-hidden="true" />
                    E-mail
                  </a>
                  {person.orcid && (
                    <a
                      href={`https://orcid.org/${person.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-cyan-300/75 hover:text-cyan-200"
                    >
                      ORCID
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tech-grid rounded-2xl border border-cyan-300/15 bg-[#071225] p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-9">
          <div>
            <h2 className="text-xl font-bold">Pronto para explorar?</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              Busque por nome, autor ou descrição e refine os resultados pelos
              critérios da sua avaliação.
            </p>
          </div>
          <Link
            href="/instrumentos"
            className="mt-5 inline-flex shrink-0 items-center rounded-lg bg-cyan-500 px-5 py-3 text-sm font-bold text-[#021018] hover:bg-cyan-300 sm:mt-0"
          >
            Acessar catálogo
          </Link>
        </section>
      </Container>
    </>
  );
}
