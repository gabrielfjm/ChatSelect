"use client";

import { useState, type FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgawwqjl";

type Status = "idle" | "submitting" | "success" | "error";
type RequiredField = "name" | "description";

const errorClasses = "border-destructive focus-visible:ring-destructive";

/** Submits via fetch so the page never reloads/redirects — Formspree
 * returns JSON instead of its default redirect when sent an Accept:
 * application/json header. Required-field validation is done by hand
 * (rather than relying on the browser's native `required` tooltip) so the
 * error is a clearly visible, styled message next to the field. */
export function RequestInstrumentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Set<RequiredField>>(new Set());
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const canSubmit = name.trim() !== "" && description.trim() !== "";

  function clearFieldError(field: RequiredField) {
    setFieldErrors((current) => {
      if (!current.has(field)) return current;
      const next = new Set(current);
      next.delete(field);
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const missing = new Set<RequiredField>();
    if (!String(formData.get("name") ?? "").trim()) missing.add("name");
    if (!String(formData.get("description") ?? "").trim())
      missing.add("description");

    if (missing.size > 0) {
      setFieldErrors(missing);
      form.querySelector<HTMLElement>(`[name="${[...missing][0]}"]`)?.focus();
      return;
    }

    setFieldErrors(new Set());
    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/10">
        <CardHeader>
          <CardTitle>Obrigado! Sua solicitação foi enviada.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Spam honeypot (Formspree convention) — left empty by real users. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="hidden"
        name="_subject"
        value="Nova solicitação de instrumento — Evalua"
      />

      <div className="space-y-1.5">
        <Label htmlFor="name">
          Nome do instrumento{" "}
          <span className="text-muted-foreground font-normal">
            (obrigatório)
          </span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: System Usability Scale (SUS)"
          aria-required="true"
          aria-invalid={fieldErrors.has("name")}
          aria-describedby={fieldErrors.has("name") ? "name-error" : undefined}
          className={cn(fieldErrors.has("name") && errorClasses)}
          onChange={(e) => {
            setName(e.target.value);
            clearFieldError("name");
          }}
        />
        {fieldErrors.has("name") && (
          <p id="name-error" role="alert" className="text-destructive text-sm">
            Preencha este campo obrigatório.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="authors">Autores / referência</Label>
        <p className="text-muted-foreground text-xs">
          Se souber, cite os autores e o ano
        </p>
        <Input
          id="authors"
          name="authors"
          placeholder="Ex.: Brooke, J. (1996)"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="link">Link do artigo ou do instrumento</Label>
        <p className="text-muted-foreground text-xs">Cole a URL, se tiver</p>
        <Input id="link" name="link" type="url" placeholder="https://" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">
          Breve descrição do que o instrumento avalia{" "}
          <span className="text-muted-foreground font-normal">
            (obrigatório)
          </span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Ex.: Escala de 10 itens para medir a usabilidade percebida de um sistema."
          rows={4}
          aria-required="true"
          aria-invalid={fieldErrors.has("description")}
          aria-describedby={
            fieldErrors.has("description") ? "description-error" : undefined
          }
          className={cn(fieldErrors.has("description") && errorClasses)}
          onChange={(e) => {
            setDescription(e.target.value);
            clearFieldError("description");
          }}
        />
        {fieldErrors.has("description") && (
          <p
            id="description-error"
            role="alert"
            className="text-destructive text-sm"
          >
            Preencha este campo obrigatório.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Seu e-mail</Label>
        <p className="text-muted-foreground text-xs">
          Opcional, caso queira retorno sobre sua sugestão
        </p>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="voce@email.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Observações adicionais</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Qualquer outra informação relevante..."
          rows={3}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-destructive text-sm">
          Não foi possível enviar sua solicitação. Tente novamente em instantes.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting" || !canSubmit}>
        {status === "submitting" ? "Enviando…" : "Enviar solicitação"}
      </Button>
    </form>
  );
}
