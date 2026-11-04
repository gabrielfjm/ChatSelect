"use client";

import { ShieldOff } from "lucide-react";
import { demoteAdmin } from "@/app/admin/admin-users-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DemoteAdminButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <ConfirmDialog
      title="Rebaixar para usuário?"
      description={
        <p>
          <strong className="text-foreground">{label}</strong> perde o acesso ao
          painel imediatamente, mas a conta continua existindo e pode ser
          promovida de novo.
        </p>
      }
      confirmLabel="Rebaixar para usuário"
      pendingLabel="Rebaixando…"
      action={demoteAdmin.bind(null, id)}
      trigger={{
        variant: "outline",
        size: "sm",
        children: (
          <>
            <ShieldOff aria-hidden="true" />
            Rebaixar para usuário
          </>
        ),
      }}
    />
  );
}
