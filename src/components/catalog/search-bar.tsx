"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <form
      ref={formRef}
      action={action}
      method="get"
      className="flex flex-col gap-2 sm:flex-row"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();

        const params = new URLSearchParams();
        const formData = new FormData(event.currentTarget);

        formData.forEach((value, key) => {
          if (typeof value === "string" && value !== "") {
            params.append(key, value);
          }
        });

        const queryString = params.toString();
        router.push(queryString ? `${action}?${queryString}` : action, {
          scroll: false,
        });
      }}
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
        key={state.q ?? ""}
        type="search"
        name="q"
        defaultValue={state.q ?? ""}
        placeholder="Buscar por título, autor ou descrição..."
        aria-label="Buscar instrumentos"
        className="h-11 border-cyan-300/20 bg-[#0c1a2e] px-4 focus-visible:ring-cyan-300"
        onChange={(e) => {
          if (e.target.value === "" && (state.q ?? "") !== "") {
            formRef.current?.requestSubmit();
          }
        }}
      />
      <Button type="submit" className="h-11 px-6 font-bold">
        Buscar
      </Button>
    </form>
  );
}
