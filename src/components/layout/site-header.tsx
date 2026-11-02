"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { AD_HOC_SLUGS } from "@/lib/catalog/ad-hoc-slugs";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/instrumentos", label: "Catálogo" },
  { href: "/ad-hoc", label: "Ad Hoc" },
  { href: "/solicitar", label: "Solicitar instrumento" },
  { href: "/sobre", label: "Sobre" },
] as const;

/** /instrumentos/[slug] is shared by validated and ad-hoc instruments, so
 * the URL prefix alone can't tell which nav item should be active — this
 * resolves it from the instrument's own classification (AD_HOC_SLUGS),
 * the same data that drives the "← Voltar ao Ad Hoc" link in the
 * instrument sidebar. Every other route just matches its own prefix. */
function resolveActiveHref(pathname: string): string {
  const detailSlug = pathname.match(/^\/instrumentos\/([^/]+)\/?$/)?.[1];
  if (detailSlug) {
    return AD_HOC_SLUGS.has(detailSlug) ? "/ad-hoc" : "/instrumentos";
  }
  const match = NAV_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
  );
  return match?.href ?? pathname;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeHref = resolveActiveHref(pathname);

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <BrandMark decorative className="size-10" />
          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-white">
              Evalua
            </span>
            <span className="hidden text-xs text-blue-200 sm:block">
              Catálogo de instrumentos de avaliação de chatbots educacionais
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b-2 border-transparent pb-1 transition-colors",
                    active
                      ? "border-white text-white"
                      : "text-blue-200 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-nav" className="border-t border-white/20 md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => {
              const active = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white"
                      : "text-blue-200 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      )}
    </header>
  );
}
