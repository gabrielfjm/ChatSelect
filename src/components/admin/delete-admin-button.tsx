"use client";

import { UserX } from "lucide-react";
import { removeAdminUser } from "@/app/admin/admin-users-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteAdminButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <ConfirmDialog
      destructive
      title="Remover administrador?"
      description={
        <p>
          <strong className="text-foreground">{label}</strong> perde o acesso ao
          painel imediatamente e a conta é apagada. Para devolver o acesso, será
          preciso cadastrar de novo.
        </p>
      }
      confirmLabel="Remover administrador"
      pendingLabel="Removendo…"
      action={removeAdminUser.bind(null, id)}
      trigger={{
        variant: "destructive",
        size: "sm",
        children: (
          <>
            <UserX aria-hidden="true" />
            Remover administrador
          </>
        ),
      }}
    />
  );
}
