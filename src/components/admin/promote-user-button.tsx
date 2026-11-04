"use client";

import { ShieldCheck } from "lucide-react";
import { promoteUser } from "@/app/admin/admin-users-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function PromoteUserButton({
  id,
  name,
  email,
}: {
  id: string;
  name: string | null;
  email: string;
}) {
  return (
    <ConfirmDialog
      title="Tornar administrador?"
      description={
        <div className="space-y-2">
          <p>
            <strong className="text-foreground">{name ?? email}</strong>
            {name ? ` (${email})` : ""} terá as mesmas permissões que você no
            painel.
          </p>
          <p>
            O cadastro não verifica o e-mail informado: confirme com a pessoa
            que esta conta é dela antes de promover.
          </p>
        </div>
      }
      confirmLabel="Tornar administrador"
      pendingLabel="Promovendo…"
      action={promoteUser.bind(null, id)}
      trigger={{
        variant: "outline",
        size: "sm",
        children: (
          <>
            <ShieldCheck aria-hidden="true" />
            Tornar administrador
          </>
        ),
      }}
    />
  );
}
