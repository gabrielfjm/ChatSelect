"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isValidListHref } from "@/lib/catalog/catalog-url";

const linkClasses =
  "inline-flex items-center gap-1 text-sm font-semibold text-cyan-300/70 hover:text-cyan-300";

export function CatalogBackLink({
  parentHref,
  parentLabel,
}: {
  parentHref: string;
  parentLabel: string;
}) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? undefined;
  const backHref = isValidListHref(from, parentHref) ? from : parentHref;

  return (
    <Link href={backHref} className={linkClasses}>
      &larr; Voltar ao {parentLabel}
    </Link>
  );
}

export function CatalogBackLinkFallback({
  parentHref,
  parentLabel,
}: {
  parentHref: string;
  parentLabel: string;
}) {
  return (
    <Link href={parentHref} className={linkClasses}>
      &larr; Voltar ao {parentLabel}
    </Link>
  );
}
