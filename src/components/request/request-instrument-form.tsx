"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  submitInstrumentRequest,
  type RequestFormState,
} from "@/app/solicitar/actions";
import {
  FieldShell,
  InstrumentFields,
} from "@/components/instrument-form/instrument-fields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialState: RequestFormState = { status: "idle" };

/** Saves the request straight into the database as `pending` (see
 * src/app/solicitar/actions.ts); an admin reviews and publishes it in
 * /admin. Submitted through onSubmit + startTransition instead of the
 * `action` prop so React doesn't reset the form — on a validation error
 * everything the person typed stays in place. */
export function RequestInstrumentForm({
  suggestions,
}: {
  suggestions?: React.ComponentProps<typeof InstrumentFields>["suggestions"];
}) {
  const [state, formAction, pending] = useActionState(
    submitInstrumentRequest,
    initialState,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  if (state.status === "success") {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/10">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <CheckCircle2
            className="size-6 text-emerald-600"
            aria-hidden="true"
          />
          <CardTitle>Obrigado! Sua solicitação foi registrada.</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Ela será revisada pela equipe e, se aprovada, passa a aparecer no
          catálogo.
        </CardContent>
      </Card>
    );
  }

  const errors = state.fieldErrors ?? {};

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Spam honeypot — invisible to people, left empty by real users. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Não preencha
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <InstrumentFields
        mode="public"
        errors={errors}
        suggestions={suggestions}
      />

      <fieldset className="space-y-5">
        <legend className="mb-4 text-lg font-semibold">Sobre você</legend>
        <FieldShell
          id="submitterName"
          label="Seu nome"
          hint="Opcional"
          error={errors.submitterName}
        >
          <Input id="submitterName" name="submitterName" />
        </FieldShell>
        <FieldShell
          id="submitterEmail"
          label="Seu e-mail"
          hint="Opcional, caso queira retorno sobre sua sugestão. Fica visível só para a equipe."
          error={errors.submitterEmail}
        >
          <Input
            id="submitterEmail"
            name="submitterEmail"
            type="email"
            placeholder="voce@email.com"
            aria-invalid={Boolean(errors.submitterEmail) || undefined}
          />
        </FieldShell>
        <FieldShell
          id="submitterNotes"
          label="Observações para a equipe"
          error={errors.submitterNotes}
        >
          <Textarea
            id="submitterNotes"
            name="submitterNotes"
            rows={3}
            placeholder="Qualquer outra informação relevante..."
          />
        </FieldShell>
      </fieldset>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar solicitação"}
      </Button>
    </form>
  );
}
