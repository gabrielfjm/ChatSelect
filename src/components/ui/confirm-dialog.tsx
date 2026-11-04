"use client";

import { useActionState, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Styled replacement for window.confirm(): a native <dialog> opened with
 * showModal(), so focus trapping, Esc-to-close and the inert background
 * come from the browser, while the look matches the rest of the site.
 * Confirming submits `action` (a Server Action) from inside the dialog;
 * if it returns `{ error }`, the message is shown in the dialog.
 */

type ConfirmResult = { error?: string } | void;
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  pendingLabel = "Aguarde…",
  cancelLabel = "Cancelar",
  destructive = false,
  action,
  trigger,
}: {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  pendingLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  action: () => ConfirmResult | Promise<ConfirmResult>;
  /** Props for the button that opens the dialog. */
  trigger: ButtonProps;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [state, formAction] = useActionState<{ error?: string }>(
    async () => (await action()) ?? {},
    {},
  );

  return (
    <>
      <Button
        type="button"
        {...trigger}
        onClick={() => dialogRef.current?.showModal()}
      />
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Click on the backdrop (the dialog element itself) closes it.
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-card text-card-foreground m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border p-0 shadow-xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-[2px]"
      >
        <form action={formAction} className="space-y-5 p-6">
          <div className="flex gap-4">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                destructive
                  ? "bg-red-100 text-red-600"
                  : "bg-secondary text-primary",
              )}
            >
              <AlertTriangle className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1.5">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </div>
            </div>
          </div>
          {state.error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {state.error}
            </p>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              autoFocus
              onClick={() => dialogRef.current?.close()}
            >
              {cancelLabel}
            </Button>
            <SubmitButton
              destructive={destructive}
              label={confirmLabel}
              pendingLabel={pendingLabel}
            />
          </div>
        </form>
      </dialog>
    </>
  );
}

function SubmitButton({
  destructive,
  label,
  pendingLabel,
}: {
  destructive: boolean;
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={destructive ? "destructive" : "default"}
      disabled={pending}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
