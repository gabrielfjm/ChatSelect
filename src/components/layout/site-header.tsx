"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
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
 * resolves it from the instrument's own classification (adHocSlugs, read
 * from the database by the root layout),
 * the same data that drives the "← Voltar ao Ad Hoc" link in the
 * instrument sidebar. Every other route just matches its own prefix. */
function resolveActiveHref(
  pathname: string,
  adHocSlugs: ReadonlySet<string>,
): string {
  const detailSlug = pathname.match(/^\/instrumentos\/([^/]+)\/?$/)?.[1];
  if (detailSlug) {
    return adHocSlugs.has(detailSlug) ? "/ad-hoc" : "/instrumentos";
  }
  const match = NAV_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(`${item.href}/`)),
  );
  return match?.href ?? pathname;
}

export interface HeaderAdmin {
  email: string;
  name: string | null;
}

/** Green dot + "Logado como …" so the admin always knows their session
 * state; logged-out visitors just see a discreet "Entrar" link. */
function LoginStatus({
  admin,
  className,
}: {
  admin: HeaderAdmin | null;
  className?: string;
}) {
  return (
    <span
      className={cn("flex items-center gap-2 text-xs text-blue-200", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 shrink-0 rounded-full",
          admin
            ? "bg-emerald-400 shadow-[0_0_0_3px] shadow-emerald-400/20"
            : "bg-slate-500",
        )}
      />
      {admin ? (
        <span className="truncate">
          Logado como{" "}
          <span className="text-white" title={admin.email}>
            {admin.name ?? admin.email}
          </span>
        </span>
      ) : (
        "Não logado"
      )}
    </span>
  );
}

function AdminActions({
  admin,
  inAdmin,
  onNavigate,
  stacked = false,
}: {
  admin: HeaderAdmin | null;
  inAdmin: boolean;
  onNavigate?: () => void;
  stacked?: boolean;
}) {
  const buttonClass =
    "border-white/25 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white";

  if (!admin) {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className={cn(buttonClass, stacked && "w-full justify-start")}
      >
        <Link href="/admin/login" onClick={onNavigate}>
          <LogIn aria-hidden="true" />
          Entrar como admin
        </Link>
      </Button>
    );
  }

  return (
    <div className={cn("flex gap-2", stacked && "flex-col")}>
      <Button
        asChild
        size="sm"
        className={cn(
          inAdmin
            ? "bg-white text-[#0F172A] hover:bg-blue-50"
            : "bg-primary hover:bg-primary-hover text-white",
          stacked && "w-full justify-start",
        )}
      >
        <Link
          href="/admin"
          onClick={onNavigate}
          aria-current={inAdmin ? "page" : undefined}
        >
          <LayoutDashboard aria-hidden="true" />
          Painel do administrador
        </Link>
      </Button>
      <form action={logout}>
        <Button
          type="submit"
          size="sm"
          variant="outline"
          className={cn(buttonClass, stacked && "w-full justify-start")}
          aria-label="Sair da conta de administrador"
          title="Sair"
        >
          <LogOut aria-hidden="true" />
          <span className={stacked ? undefined : "sr-only"}>Sair</span>
        </Button>
      </form>
    </div>
  );
}

export function SiteHeader({
  adHocSlugs,
  admin,
}: {
  adHocSlugs: string[];
  admin: HeaderAdmin | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const adHocSet = useMemo(() => new Set(adHocSlugs), [adHocSlugs]);
  const activeHref = resolveActiveHref(pathname, adHocSet);
  const inAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A]">
      {admin && (
        <div className="hidden border-b border-white/10 lg:block">
          <Container className="flex justify-end py-1.5">
            <LoginStatus admin={admin} />
          </Container>
        </div>
      )}
      <Container className="flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <BrandMark decorative className="size-10" />
          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-white">
              ChatSelect
            </span>
            <span className="hidden text-xs text-blue-200 sm:block">
              Evidências para avaliar chatbots educacionais
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden gap-6 text-sm font-medium lg:flex">
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

          <div className="hidden items-center border-l border-white/15 pl-5 lg:flex">
            <AdminActions admin={admin} inAdmin={inAdmin} />
          </div>

          {admin && (
            <span
              className="size-2.5 rounded-full bg-emerald-400 lg:hidden"
              title={`Logado como ${admin.name ?? admin.email}`}
              aria-label={`Logado como ${admin.name ?? admin.email}`}
              role="img"
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white lg:hidden"
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
        <nav id="mobile-nav" className="border-t border-white/20 lg:hidden">
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
            <div className="mt-2 space-y-3 border-t border-white/15 px-2 pt-4">
              <LoginStatus admin={admin} />
              <AdminActions
                admin={admin}
                inAdmin={inAdmin}
                onNavigate={() => setOpen(false)}
                stacked
              />
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}
