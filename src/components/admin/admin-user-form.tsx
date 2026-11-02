"use client";

import {
  startTransition,
  useActionState,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import {
  saveAdminUser,
  type AdminUserFormState,
} from "@/app/admin/admin-users-actions";
import { FieldShell } from "@/components/instrument-form/instrument-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const initialState: AdminUserFormState = { status: "idle" };
const errorClasses = "border-destructive focus-visible:ring-destructive";

/** 16 chars from an alphabet without look-alikes (0/O, 1/l/I), so it can
 * be read out or typed by the new admin without mistakes. */
function generatePassword(): string {
  const alphabet =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
  const bytes = crypto.getRandomValues(new Uint32Array(16));
  return Array.from(bytes, (n) => alphabet[n % alphabet.length]).join("");
}

export function AdminUserForm({
  id,
  defaults,
  emailLocked = false,
  isSelf = false,
}: {
  id: string | null;
  defaults?: { name: string | null; email: string };
  /** Fixed (ADMIN_EMAILS) admins keep their e-mail. */
  emailLocked?: boolean;
  isSelf?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    saveAdminUser.bind(null, id),
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  // Generating a password makes the previous submit's password errors
  // stale — hide them until the next submit returns a new state.
  const [passwordErrorsClearedFor, setPasswordErrorsClearedFor] =
    useState<AdminUserFormState | null>(null);
  const errors =
    passwordErrorsClearedFor === state
      ? {
          ...state.fieldErrors,
          password: undefined,
          passwordConfirm: undefined,
        }
      : (state.fieldErrors ?? {});
  const creating = id === null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(() => formAction(formData));
  }

  function fillGeneratedPassword() {
    const password = generatePassword();
    if (passwordRef.current) passwordRef.current.value = password;
    if (confirmRef.current) confirmRef.current.value = password;
    setShowPassword(true);
    setPasswordErrorsClearedFor(state);
    passwordRef.current?.select();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FieldShell id="name" label="Nome" required error={errors.name}>
        <Input
          id="name"
          name="name"
          defaultValue={defaults?.name ?? ""}
          autoComplete="off"
          aria-invalid={Boolean(errors.name) || undefined}
          className={cn(errors.name && errorClasses)}
        />
      </FieldShell>

      <FieldShell
        id="email"
        label="E-mail"
        required
        hint={
          emailLocked
            ? "Administrador fixo (ADMIN_EMAILS): o e-mail só muda na configuração do servidor."
            : "Usado para entrar no painel."
        }
        error={errors.email}
      >
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={defaults?.email ?? ""}
          readOnly={emailLocked}
          autoComplete="off"
          aria-invalid={Boolean(errors.email) || undefined}
          className={cn(
            emailLocked && "bg-muted text-muted-foreground",
            errors.email && errorClasses,
          )}
        />
      </FieldShell>

      <fieldset className="space-y-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">
          {creating ? "Senha inicial" : "Trocar senha"}
        </legend>
        <p className="text-muted-foreground text-xs">
          {creating
            ? "Combine a senha com a pessoa por um canal seguro. Ela pode trocá-la depois em “Minha conta”."
            : isSelf
              ? "Deixe em branco para manter a senha atual."
              : "Deixe em branco para manter a senha atual. Se definir uma nova, avise a pessoa."}
        </p>
        <FieldShell
          id="password"
          label={creating ? "Senha" : "Nova senha"}
          required={creating}
          hint="Mínimo de 8 caracteres."
          error={errors.password}
        >
          <div className="flex gap-2">
            <Input
              ref={passwordRef}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password) || undefined}
              className={cn("font-mono", errors.password && errorClasses)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </Button>
          </div>
        </FieldShell>
        <FieldShell
          id="passwordConfirm"
          label="Confirmar senha"
          error={errors.passwordConfirm}
        >
          <Input
            ref={confirmRef}
            id="passwordConfirm"
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.passwordConfirm) || undefined}
            className={cn("font-mono", errors.passwordConfirm && errorClasses)}
          />
        </FieldShell>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={fillGeneratedPassword}
        >
          <KeyRound aria-hidden="true" />
          Gerar senha forte
        </Button>
      </fieldset>

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Salvando…"
            : creating
              ? "Cadastrar administrador"
              : "Salvar alterações"}
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
