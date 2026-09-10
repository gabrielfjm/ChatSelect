"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/instrumentos", label: "Catálogo" },
  { href: "/ad-hoc", label: "Ad Hoc" },
  { href: "/solicitar", label: "Sugerir" },
  { href: "/sobre", label: "Sobre" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-300/10 bg-[#050c1a]/90 backdrop-blur-xl">
      <Container className="flex min-h-18 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <BrandMark
            decorative
            className="size-10 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
          />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold tracking-tight text-white">
              Chat<span className="text-cyan-400">Select</span>
            </span>
            <span className="text-muted-foreground hidden text-[0.7rem] tracking-wide sm:block">
              Evidências para avaliar chatbots educacionais
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                    active
                      ? "bg-cyan-300/10 text-cyan-300"
                      : "text-slate-300/80 hover:bg-white/5 hover:text-white",
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
            className="border border-cyan-300/15 text-white hover:bg-cyan-300/10 hover:text-white lg:hidden"
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
        <nav
          id="mobile-nav"
          className="border-t border-cyan-300/10 bg-[#071225] lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-cyan-300/10 text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
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
