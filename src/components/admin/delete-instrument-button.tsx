"use client";

import { Trash2 } from "lucide-react";
import { removeInstrument } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteInstrumentButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <ConfirmDialog
      destructive
      title="Excluir instrumento?"
      description={
        <>
          <p>
            <strong className="text-foreground">“{title}”</strong> será apagado
            definitivamente. Isso não pode ser desfeito.
          </p>
          <p className="mt-2">
            Para só tirar do site, use “Rejeitar” ou “Despublicar”.
          </p>
        </>
      }
      confirmLabel="Excluir definitivamente"
      pendingLabel="Excluindo…"
      action={removeInstrument.bind(null, id)}
      trigger={{
        variant: "destructive",
        size: "sm",
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
