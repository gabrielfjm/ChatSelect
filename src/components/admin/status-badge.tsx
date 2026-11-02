import type { InstrumentStatus } from "@/core/models/instrument";
import { cn } from "@/lib/utils";

export const STATUS_LABELS: Record<InstrumentStatus, string> = {
  pending: "Pendente",
  approved: "Publicado",
  rejected: "Rejeitado",
};

const STATUS_CLASSES: Record<InstrumentStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ status }: { status: InstrumentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_CLASSES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
