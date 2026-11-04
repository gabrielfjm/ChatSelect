"use client";

import { Trash2 } from "lucide-react";
import { removeUserAccount } from "@/app/admin/admin-users-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteAccountButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <ConfirmDialog
      destructive
      title="Excluir conta?"
      description={
        <p>
          A conta de <strong className="text-foreground">{label}</strong> é
          apagada definitivamente e o e-mail fica livre para um novo cadastro.
        </p>
      }
      confirmLabel="Excluir conta"
      pendingLabel="Excluindo…"
      action={removeUserAccount.bind(null, id)}
      trigger={{
        variant: "ghost",
        size: "sm",
        className: "text-destructive hover:text-destructive",
        children: (
          <>
            <Trash2 aria-hidden="true" />
            Excluir
          </>
        ),
      }}
    />
  );
}
