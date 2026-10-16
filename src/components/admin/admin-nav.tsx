"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Section tabs in the admin sub-bar. "Minha conta" is the signed-in
 * admin's own page in /admin/administradores/[id]. */
export function AdminNav({ selfId }: { selfId: string }) {
  const pathname = usePathname();
  const selfHref = `/admin/administradores/${selfId}`;
  const items = [
    {
      href: "/admin",
      label: "Instrumentos",
      active:
        pathname === "/admin" || pathname.startsWith("/admin/instrumentos"),
    },
    {
      href: "/admin/administradores",
      label: "Administradores",
      active:
        pathname.startsWith("/admin/administradores") && pathname !== selfHref,
    },
    { href: selfHref, label: "Minha conta", active: pathname === selfHref },
  ];

  return (
    <nav aria-label="Seções do painel" className="flex gap-1 overflow-x-auto">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
            item.active
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
