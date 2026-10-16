"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { saveInstrument, type InstrumentFormState } from "@/app/admin/actions";
import {
  FieldShell,
  InstrumentFields,
  type InstrumentDefaults,
} from "@/components/instrument-form/instrument-fields";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const initialState: InstrumentFormState = { status: "idle" };

/** Create (id = null) or edit a ficha. Same no-reset submit as the public
 * form so a validation error never wipes what the admin typed. */
export function AdminInstrumentForm({
  id,
  defaults,
  reviewNotes,
  suggestions,
}: {
  id: string | null;
  defaults?: InstrumentDefaults;
  reviewNotes?: string | null;
  suggestions?: React.ComponentProps<typeof InstrumentFields>["suggestions"];
}) {
  const [state, formAction, pending] = useActionState(
    saveInstrument.bind(null, id),
    initialState,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <InstrumentFields
        mode="admin"
        defaults={defaults}
        errors={state.fieldErrors}
        suggestions={suggestions}
      />

      {id ? (
        <FieldShell
          id="reviewNotes"
          label="Notas internas da revisão"
          hint="Visíveis só no painel. Ex.: o que foi completado ou por que foi rejeitado."
        >
          <Textarea
            id="reviewNotes"
            name="reviewNotes"
            rows={3}
            defaultValue={reviewNotes ?? ""}
          />
        </FieldShell>
      ) : (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Ao salvar</legend>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="approved"
              defaultChecked
              className="accent-primary"
            />
            Publicar no catálogo agora
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="status"
              value="pending"
              className="accent-primary"
            />
            Salvar como rascunho (pendente)
          </label>
        </fieldset>
      )}

      <div className="bg-background sticky bottom-0 -mx-6 flex items-center gap-4 border-t px-6 py-4">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Salvando…"
            : id
              ? "Salvar alterações"
              : "Criar instrumento"}
        </Button>
        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={
              state.status === "error"
                ? "text-destructive text-sm"
                : "text-sm text-emerald-700"
            }
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
