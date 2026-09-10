import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { InstrumentSidebar } from "@/components/instrument/instrument-sidebar";
import { InstrumentMeta } from "@/components/instrument/instrument-meta";
import { TextSection } from "@/components/instrument/text-section";
import { ProsConsSection } from "@/components/instrument/pros-cons-section";
import { SourceSection } from "@/components/instrument/source-section";
import { DualApplicationNotice } from "@/components/instrument/dual-application-notice";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { findInstrumentBySlug } from "@/lib/catalog/catalog-service";

interface InstrumentPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllInstruments().map((instrument) => ({ slug: instrument.slug }));
}

export async function generateMetadata({
  params,
}: InstrumentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const instrument = findInstrumentBySlug(getAllInstruments(), slug);
  if (!instrument) return {};
  return {
    title: instrument.title,
    description: instrument.description ?? undefined,
  };
}

export default async function InstrumentPage({ params }: InstrumentPageProps) {
  const { slug } = await params;
  const instrument = findInstrumentBySlug(getAllInstruments(), slug);
  if (!instrument) notFound();

  // Ad-hoc instruments are only ever linked from /ad-hoc (the /instrumentos
  // catalog excludes them), so classification alone tells us where "back"
  // belongs.
  const isAdHoc = instrument.classification === "ad-hoc";
  const parentHref = isAdHoc ? "/ad-hoc" : "/instrumentos";
  const parentLabel = isAdHoc ? "Ad Hoc" : "Catálogo";

  return (
    <Container className="py-10 sm:py-14">
      <Card className="grid overflow-hidden border-cyan-300/15 p-0 shadow-[0_20px_70px_rgba(0,0,0,0.24)] lg:grid-cols-[300px_1fr]">
        <InstrumentSidebar
          instrument={instrument}
          parentHref={parentHref}
          parentLabel={parentLabel}
        />
        <div className="space-y-8 bg-[#0a1628] px-6 py-8 sm:px-8">
          {instrument.isDualApplication && <DualApplicationNotice />}
          <TextSection
            title="Descrição do instrumento"
            text={instrument.instrumentDescription}
          />
          <InstrumentMeta instrument={instrument} />
          <TextSection title="Como pontuar" text={instrument.scoring} />
          <TextSection title="Confiabilidade" text={instrument.reliability} />
          <TextSection
            title="Resultado de referência"
            text={instrument.referenceResult}
          />
          <ProsConsSection
            advantages={instrument.advantages}
            limitations={instrument.limitations}
          />
          <SourceSection source={instrument.source} />
        </div>
      </Card>
    </Container>
  );
}
