import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CatalogLoading } from "@/components/catalog/catalog-loading";
import { Container } from "@/components/layout/container";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { filterByClassification } from "@/lib/catalog/catalog-service";

export const metadata: Metadata = {
  title: "Instrumentos",
  description:
    "Catálogo de instrumentos para avaliação de chatbots educacionais.",
};

export default function CatalogPage() {
  const instruments = filterByClassification(getAllInstruments(), "adapted");

  return (
    <>
      <section className="tech-grid border-b border-cyan-300/10 bg-[radial-gradient(ellipse_50%_100%_at_15%_50%,rgba(14,162,189,0.1),transparent_72%),#071225]">
        <Container className="py-12 sm:py-16">
          <p className="mb-3 text-xs font-bold tracking-[0.16em] text-cyan-300 uppercase">
            Instrumentos validados
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Catálogo de instrumentos
          </h1>
          <p className="text-muted-foreground mt-4 max-w-3xl text-sm leading-7 sm:text-base">
            Compare questionários, escalas, entrevistas e rubricas com origem em
            fontes psicométricas identificáveis e evidências de validação.
          </p>
        </Container>
      </section>

      <Suspense fallback={<CatalogLoading />}>
        <CatalogBrowser basePath="/instrumentos" instruments={instruments} />
      </Suspense>
    </>
  );
}
