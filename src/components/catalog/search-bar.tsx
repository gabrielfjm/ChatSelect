"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FACET_KEYS } from "@/core/models/catalog-query";
import type { CatalogUrlState } from "@/lib/catalog/catalog-url";

/** Plain GET form (still works with JS disabled) — preserves every active
 * facet via hidden fields, resets to page defaults on a new search. The
 * field auto-submits when cleared (backspacing to empty, or the browser's
 * native × button on type="search"), so the full list reappears immediately
 * instead of staying stuck on a stale "no results" state until the next
 * manual submit. */
export function SearchBar({
  action,
  state,
}: {
  action: string;
  state: CatalogUrlState;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={action}
      method="get"
      className="flex gap-2"
      role="search"
    >
      {FACET_KEYS.flatMap((key) =>
        (state[key] ?? []).map((value) => (
          <input
            key={`${key}:${value}`}
            type="hidden"
            name={key}
            value={value}
          />
        )),
      )}
      <Input
        type="search"
        name="q"
        defaultValue={state.q ?? ""}
        placeholder="Buscar por título, autor ou descrição..."
        aria-label="Buscar instrumentos"
        onChange={(e) => {
          if (e.target.value === "" && (state.q ?? "") !== "") {
            formRef.current?.requestSubmit();
          }
        }}
      />
      <Button type="submit">Buscar</Button>
    </form>
  );
}
