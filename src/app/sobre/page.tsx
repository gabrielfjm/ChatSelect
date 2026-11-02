import type { Metadata } from "next";
import { BookOpen, Database, Mail, Search, User } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre o Evalua e como o catálogo foi construído.",
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
    name: "Leo Natan Paschoal",
    institution: "PUCPR",
    email: "leo.paschoal@pucpr.edu.br",
    orcid: "0000-0003-1076-9174",
  },
  {
    name: "Pedro Henrique Dias Valle",
    institution: "IME-USP",
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
    text: "As fichas organizam descrição, perspectiva de qualidade, modalidade, idioma, aplicação, confiabilidade e fonte bibliográfica.",
  },
  {
    icon: Search,
    title: "Seleção apoiada",
    text: "Busca e filtros reduzem o esforço de localizar alternativas e tornam a comparação mais sistemática, transparente e fundamentada.",
  },
] as const;

export default function AboutPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sobre o Evalua</h1>
        <p className="text-muted-foreground">
          Uma ferramenta web criada para apoiar pesquisadores na escolha de
          instrumentos adequados à avaliação de chatbots educacionais.
        </p>
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">
          Menos tempo procurando. Mais critério escolhendo.
        </h2>
        <p>
          A avaliação de chatbots educacionais envolve dimensões técnicas,
          pedagógicas e de experiência do usuário. Apesar da variedade de
          questionários, escalas, entrevistas e rubricas disponível, as
          informações necessárias para escolher entre eles permanecem
          distribuídas por diferentes publicações.
        </p>
        <p>
          O Evalua centraliza esse conhecimento em fichas comparáveis. Assim,
          pesquisadores podem identificar alternativas compatíveis com seus
          objetivos, consultar evidências de validação e acessar a fonte
          original de cada instrumento.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {RESEARCH_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title}>
              <CardContent className="pt-6">
                <span className="bg-secondary text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="font-semibold">{pillar.title}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {pillar.text}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Autoria</h2>
          <div className="bg-primary-hover mt-2 h-[3px] w-12" />
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((person) => (
            <Card key={person.name}>
              <CardContent className="space-y-2 pt-6 text-center">
                {/* Placeholder avatar — swap for <img src="..." /> once
                    real photos are available, keeping this same circle. */}
                <div className="bg-secondary mx-auto flex size-20 items-center justify-center rounded-full">
                  <User className="text-primary size-10" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold">{person.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {person.institution}
                  </p>
                </div>
                <div className="space-y-1">
                  <a
                    href={`mailto:${person.email}`}
                    className="text-primary hover:text-primary-hover inline-flex items-center gap-1 text-xs break-all hover:underline"
                  >
                    <Mail className="size-3 shrink-0" aria-hidden="true" />
                    {person.email}
                  </a>
                  {person.orcid && (
                    <a
                      href={`https://orcid.org/${person.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover block text-xs hover:underline"
                    >
                      ORCID
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
