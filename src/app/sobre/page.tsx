import Link from "next/link";
import type { Metadata } from "next";
import { Mail, User } from "lucide-react";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Sobre o ChatSelect e como o catálogo foi construído.",
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

export default function AboutPage() {
  return (
    <Container className="max-w-3xl space-y-6 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sobre o ChatSelect
        </h1>
        <p className="text-muted-foreground">
          Um catálogo de instrumentos de avaliação para pesquisa em chatbots
          educacionais.
        </p>
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Motivação</h2>
        <p>
          O ChatSelect nasceu de uma dificuldade concreta, vivida durante
          nossa própria pesquisa: ao planejar a avaliação de um chatbot
          educacional, percebemos que não havia um lugar único onde comparar
          os instrumentos disponíveis na literatura. Cada busca no Google
          Scholar trazia dezenas de questionários e escalas espalhados em
          artigos diferentes, sem forma fácil de comparar confiabilidade,
          idioma ou adequação ao nosso contexto. Esse catálogo é o resultado
          de organizar, para nós mesmos, o que gostaríamos de ter encontrado
          pronto — e agora compartilhamos com quem enfrenta o mesmo problema.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">Como usar</h2>
        <p>
          Navegue pela lista de instrumentos na aba{" "}
          <Link
            href="/instrumentos"
            className="text-primary hover:text-primary-hover hover:underline"
          >
            Catálogo
          </Link>
          , busque por nome, autor ou descrição, ou filtre por categoria,
          idioma, modalidade de comunicação e atributos. Clique em um
          instrumento para ver a ficha completa. Se você conhece um
          instrumento que não está no catálogo, sugira sua inclusão na aba{" "}
          <Link
            href="/solicitar"
            className="text-primary hover:text-primary-hover hover:underline"
          >
            Solicitar instrumento
          </Link>
          .
        </p>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Autoria</h2>
          <div className="bg-primary-hover mt-2 h-[3px] w-12" />
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {TEAM.map((person) => (
            <div key={person.name} className="space-y-2 text-center">
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
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
