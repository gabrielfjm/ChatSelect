import Link from "next/link";
import { ChevronRight, UserPlus } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth/admin";
import { listAdminAccounts } from "@/lib/auth/admin-users-repository";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

function initials(nameOrEmail: string): string {
  const parts = nameOrEmail.split(/[\s@._-]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ excluido?: string }>;
}) {
  const me = await requireAdmin();
  const { excluido } = await searchParams;
  const admins = await listAdminAccounts();

  return (
    <Container className="max-w-4xl space-y-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground text-sm">
            Quem pode entrar no painel para revisar solicitações e editar o
            catálogo.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/administradores/novo">
            <UserPlus aria-hidden="true" />
            Novo administrador
          </Link>
        </Button>
      </div>

      {excluido === "1" && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          Administrador removido.
        </p>
      )}

      <Card className="divide-y overflow-hidden p-0">
        {admins.map((admin) => (
          <Link
            key={admin.id}
            href={`/admin/administradores/${admin.id}`}
            className="hover:bg-accent flex items-center gap-4 px-5 py-4"
          >
            <span
              aria-hidden="true"
              className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            >
              {initials(admin.name ?? admin.email)}
            </span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                <span className="truncate">{admin.name ?? admin.email}</span>
                {admin.id === me.id && (
                  <span className="bg-primary rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                    Você
                  </span>
                )}
                {admin.fixed && (
                  <span
                    className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700"
                    title="Definido em ADMIN_EMAILS na configuração do servidor"
                  >
                    Fixo
                  </span>
                )}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {admin.name ? `${admin.email} · ` : ""}
                {admin.lastSignInAt
                  ? `último acesso ${dateFormat.format(new Date(admin.lastSignInAt))}`
                  : "ainda não entrou"}
              </p>
            </div>
            <ChevronRight
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </Card>

      <p className="text-muted-foreground text-xs">
        Administradores marcados como <strong>Fixo</strong> vêm da variável{" "}
        <code>ADMIN_EMAILS</code> do servidor: são a garantia de acesso caso
        todos os outros sejam removidos, por isso não podem ser excluídos por
        aqui.
      </p>
    </Container>
  );
}
