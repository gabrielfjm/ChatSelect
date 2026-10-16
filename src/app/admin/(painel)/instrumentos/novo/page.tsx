import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { AdminInstrumentForm } from "@/components/admin/admin-instrument-form";
import { requireAdmin } from "@/lib/auth/admin";
import { getAllInstruments } from "@/lib/catalog/instruments-repository";
import { getFieldSuggestions } from "@/lib/catalog/catalog-service";

export default async function NewInstrumentPage() {
  await requireAdmin();
  const suggestions = getFieldSuggestions(await getAllInstruments());

  return (
    <Container className="max-w-3xl space-y-6 py-8">
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar ao painel
      </Link>
      <h1 className="text-2xl font-bold tracking-tight">Novo instrumento</h1>
      <Card className="p-6">
        <AdminInstrumentForm id={null} suggestions={suggestions} />
      </Card>
    </Container>
  );
}
