import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
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

export default function HomePage() {
  const all = getAllInstruments();
  const adHocCount = filterByClassification(all, "ad-hoc").length;
  const adaptedCount = all.length - adHocCount;

  return (
    <>
      <section className="bg-[#0F172A] py-20">
        <Container className="max-w-3xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Já perdeu tempo procurando qual instrumento usar para avaliar seu
            chatbot educacional?
          </h1>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/instrumentos">Explorar catálogo</Link>
          </Button>
        </Container>
      </section>

      <section className="bg-background py-16">
        <Container className="max-w-3xl space-y-3">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            O problema
          </p>
          <p className="text-sm leading-relaxed">
            Pesquisadores que avaliam chatbots educacionais frequentemente
            precisam escolher, entre dezenas de questionários, escalas,
            entrevistas e rubricas espalhados pela literatura, qual
            instrumento usar para medir usabilidade, satisfação, engajamento,
            confiança ou efetividade pedagógica. Essa escolha é difícil
            quando não há um lugar único reunindo essas opções lado a lado.
          </p>
        </Container>
      </section>

      <section className="bg-accent py-16">
        <Container className="max-w-3xl space-y-3">
          <p className="text-primary text-xs font-semibold tracking-wide uppercase">
            O catálogo
          </p>
          <p className="text-sm leading-relaxed">
            O ChatSelect reúne {all.length} instrumentos extraídos de artigos
            científicos que avaliaram chatbots em contextos educacionais.
            Cada ficha documenta autores, idioma original, traduções, amostra
            do estudo, número de itens, formato de resposta, forma de
            pontuação, confiabilidade, vantagens, limitações e a fonte
            bibliográfica completa.
          </p>
          <p className="text-sm leading-relaxed">
            Cada instrumento passou por uma triagem quanto à sua origem:
            instrumentos com fonte psicométrica validada e citável, como a
            SUS ou o TAM, compõem a lista principal ({adaptedCount}{" "}
            instrumentos); já os instrumentos Ad Hoc ({adHocCount}{" "}
            instrumentos) — criados pelos próprios autores de um estudo
            especificamente para aquela pesquisa, geralmente sem dados
            formais de confiabilidade — ficam reunidos separadamente na aba{" "}
            <Link
              href="/ad-hoc"
              className="text-primary hover:text-primary-hover hover:underline"
            >
              Ad Hoc
            </Link>
            . A página inicial mostra apenas os instrumentos com origem
            validada; a lista completa de instrumentos Ad Hoc fica na aba{" "}
            <Link
              href="/ad-hoc"
              className="text-primary hover:text-primary-hover hover:underline"
            >
              Ad Hoc
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="bg-[#0F172A] py-16">
        <Container className="space-y-10 text-center">
          <div className="mx-auto grid max-w-xl grid-cols-3 gap-6">
            <div>
              <p className="text-4xl font-bold text-white">{all.length}</p>
              <p className="text-sm text-blue-300">Instrumentos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{adaptedCount}</p>
              <p className="text-sm text-blue-300">Validados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{adHocCount}</p>
              <p className="text-sm text-blue-300">Ad Hoc</p>
            </div>
          </div>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/instrumentos">Ir para o Catálogo</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
