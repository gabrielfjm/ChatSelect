"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/instrumentos", label: "Catálogo" },
  { href: "/ad-hoc", label: "Instrumentos personalizados" },
  { href: "/solicitar", label: "Solicitar instrumento" },
  { href: "/sobre", label: "Sobre" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]">
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link href="/" className="leading-tight" onClick={() => setOpen(false)}>
          <span className="block text-lg font-semibold tracking-tight text-white">
            ChatSelect
          </span>
          <span className="hidden text-xs text-blue-200 sm:block">
            Catálogo de instrumentos para avaliação de chatbots educacionais
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "border-b-2 border-transparent pb-1 transition-colors",
                    active ? "border-white text-white" : "text-blue-200 hover:text-white",
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
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
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
