import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

/** Gate for every /admin page except /admin/login. Pages and actions still
 * check on their own (layouts don't re-run on every navigation). */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="bg-muted/50 min-h-full">
      <div className="bg-background border-b">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-2.5">
          <Link href="/admin" className="font-semibold">
            Painel do administrador
          </Link>
          <AdminNav selfId={admin.id} />
        </Container>
      </div>
      {children}
    </div>
  );
}
