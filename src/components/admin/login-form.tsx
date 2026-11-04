"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { FieldShell } from "@/components/instrument-form/instrument-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  // Not the `action` prop: React would reset the form after a failed
  // attempt, wiping the e-mail the admin just typed. noValidate keeps the
  // browser's own validation bubbles out — the server's message is shown
  // in the page instead.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FieldShell id="email" label="E-mail">
        <Input id="email" name="email" type="email" autoComplete="email" />
      </FieldShell>
      <FieldShell id="password" label="Senha">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
      </FieldShell>
      {state.error && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
