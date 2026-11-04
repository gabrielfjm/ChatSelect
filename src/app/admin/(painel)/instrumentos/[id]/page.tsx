import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ExternalLink, RotateCcw, X } from "lucide-react";
import type { InstrumentStatus } from "@/core/models/instrument";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdminInstrumentForm } from "@/components/admin/admin-instrument-form";
import { DeleteInstrumentButton } from "@/components/admin/delete-instrument-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { changeStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAllInstruments,
  getInstrumentRecord,
} from "@/lib/catalog/instruments-repository";
import { getFieldSuggestions } from "@/lib/catalog/catalog-service";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Which status buttons make sense from each status. */
const STATUS_ACTIONS: Record<
  InstrumentStatus,
  {
    status: InstrumentStatus;
    label: string;
    icon: typeof Check;
    variant: "default" | "outline";
  }[]
> = {
  pending: [
    {
      status: "approved",
      label: "Aprovar e publicar",
      icon: Check,
      variant: "default",
    },
    { status: "rejected", label: "Rejeitar", icon: X, variant: "outline" },
  ],
  approved: [
    {
      status: "pending",
      label: "Despublicar",
      icon: RotateCcw,
      variant: "outline",
    },
  ],
  rejected: [
    {
      status: "approved",
      label: "Aprovar e publicar",
      icon: Check,
      variant: "default",
    },
    {
      status: "pending",
      label: "Voltar para pendente",
      icon: RotateCcw,
      variant: "outline",
    },
  ],
};

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-sm break-words whitespace-pre-line">{value}</dd>
    </div>
  );
}

export default async function EditInstrumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { criado } = await searchParams;
  if (!UUID_PATTERN.test(id)) notFound();

  const record = await getInstrumentRecord(id);
  if (!record) notFound();
  const suggestions = getFieldSuggestions(await getAllInstruments());

  return (
    <Container className="space-y-6 py-8">
      <Link
        href={`/admin?status=${record.status}`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar ao painel
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{record.title}</h1>
        <StatusBadge status={record.status} />
      </div>

      {criado === "1" && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          Instrumento criado.
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <AdminInstrumentForm
            id={record.id}
            defaults={record}
            reviewNotes={record.reviewNotes}
            suggestions={suggestions}
          />
        </Card>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Card className="space-y-4 p-5">
            <h2 className="font-semibold">Publicação</h2>
            <p className="text-muted-foreground text-xs">
              Salve as alterações da ficha antes de mudar o status.
            </p>
            <div className="flex flex-col gap-2">
              {STATUS_ACTIONS[record.status].map((action) => {
                const Icon = action.icon;
                return (
                  <form
                    key={action.status}
                    action={changeStatus.bind(null, record.id)}
                  >
                    <input type="hidden" name="status" value={action.status} />
                    <Button
                      type="submit"
                      variant={action.variant}
                      className="w-full"
                    >
                      <Icon aria-hidden="true" />
                      {action.label}
                    </Button>
                  </form>
                );
              })}
              {record.status === "approved" && (
                <Button asChild variant="link" className="justify-start px-0">
                  <Link href={`/instrumentos/${record.slug}`} target="_blank">
                    Ver no site
                    <ExternalLink aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </div>
            <dl className="space-y-2 border-t pt-4">
              <InfoRow
                label="Recebido em"
                value={dateFormat.format(new Date(record.createdAt))}
              />
              <InfoRow
                label="Última revisão"
                value={
                  record.reviewedAt
                    ? `${dateFormat.format(new Date(record.reviewedAt))}${record.reviewedBy ? ` por ${record.reviewedBy}` : ""}`
                    : null
                }
              />
            </dl>
          </Card>

          {(record.submitterName ||
            record.submitterEmail ||
            record.submitterNotes) && (
            <Card className="space-y-3 p-5">
              <h2 className="font-semibold">Enviado por</h2>
              <dl className="space-y-2">
                <InfoRow label="Nome" value={record.submitterName} />
                <InfoRow label="E-mail" value={record.submitterEmail} />
                <InfoRow label="Observações" value={record.submitterNotes} />
              </dl>
            </Card>
          )}

          <Card className="space-y-3 p-5">
            <h2 className="font-semibold">Zona de perigo</h2>
            <DeleteInstrumentButton id={record.id} title={record.title} />
          </Card>
        </aside>
      </div>
    </Container>
  );
}
