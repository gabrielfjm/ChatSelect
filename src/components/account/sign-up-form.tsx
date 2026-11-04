"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { signUp, type SignUpFormState } from "@/app/cadastro/actions";
import { FieldShell } from "@/components/instrument-form/instrument-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: SignUpFormState = { status: "idle" };
const errorClasses = "border-destructive focus-visible:ring-destructive";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const errors = state.fieldErrors ?? {};

  // Not the `action` prop: React would reset the form after a failed attempt,
  // wiping what the person just typed. noValidate keeps the browser's own
  // validation bubbles out — the server's messages are shown in the page.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Spam honeypot — invisible to people, left empty by real users. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Não preencha
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <FieldShell id="name" label="Nome" error={errors.name}>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          aria-invalid={Boolean(errors.name) || undefined}
          className={cn(errors.name && errorClasses)}
        />
      </FieldShell>
      <FieldShell id="email" label="E-mail" error={errors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email) || undefined}
          className={cn(errors.email && errorClasses)}
        />
      </FieldShell>
      <FieldShell
        id="password"
        label="Senha"
        hint="Mínimo de 8 caracteres."
        error={errors.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password) || undefined}
          className={cn(errors.password && errorClasses)}
        />
      </FieldShell>
      <FieldShell
        id="passwordConfirm"
        label="Confirmar senha"
        error={errors.passwordConfirm}
      >
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.passwordConfirm) || undefined}
          className={cn(errors.passwordConfirm && errorClasses)}
        />
      </FieldShell>
      {state.message && (
        <p role="alert" className="text-destructive text-sm">
          {state.message}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Criando conta…" : "Criar conta"}
      </Button>
    </form>
  );
}
