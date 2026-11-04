import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteAccountButton } from "@/components/admin/delete-account-button";
import { DemoteAdminButton } from "@/components/admin/demote-admin-button";
import { PromoteUserButton } from "@/components/admin/promote-user-button";
import { requireAdmin } from "@/lib/auth/admin";
import { listUserAccounts } from "@/lib/auth/admin-users-repository";

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{
    promovido?: string;
    rebaixado?: string;
    excluida?: string;
  }>;
}) {
  const me = await requireAdmin();
  const { promovido, rebaixado, excluida } = await searchParams;
  const accounts = await listUserAccounts();
  const notice =
    (promovido === "1" && "Usuário promovido a administrador.") ||
    (rebaixado === "1" && "Administrador rebaixado para usuário.") ||
    (excluida === "1" && "Conta excluída.");

  return (
    <Container className="max-w-4xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contas criadas</h1>
        <p className="text-muted-foreground text-sm">
          Todas as contas do site, das mais recentes para as mais antigas.
          Promova um usuário para dar a ele acesso ao painel.
        </p>
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          {notice}
        </p>
      )}

      <Card className="divide-y overflow-hidden p-0">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4"
          >
            <div className="min-w-0 flex-1 basis-64 space-y-0.5">
              <p className="flex flex-wrap items-center gap-2 font-medium">
                <span className="truncate">
                  {account.name ?? account.email}
                </span>
                {account.id === me.id && (
                  <span className="bg-primary rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                    Você
                  </span>
                )}
                {account.isAdmin ? (
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-semibold">
                    Administrador
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                    Usuário
                  </span>
                )}
                {account.fixed && (
                  <span
                    className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700"
                    title="Definido em ADMIN_EMAILS na configuração do servidor"
                  >
                    Fixo
                  </span>
                )}
              </p>
              <p className="text-muted-foreground text-xs break-words">
                {account.name ? `${account.email} · ` : ""}
                criada em {dateFormat.format(new Date(account.createdAt))}
                {" · "}
                {account.lastSignInAt
                  ? `último acesso ${dateFormat.format(new Date(account.lastSignInAt))}`
                  : "ainda não entrou"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {account.isAdmin ? (
                <>
                  {account.id !== me.id && !account.fixed && (
                    <DemoteAdminButton
                      id={account.id}
                      label={account.name ?? account.email}
                    />
                  )}
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/administradores/${account.id}`}>
                      Ver administrador
                      <ChevronRight aria-hidden="true" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <PromoteUserButton
                    id={account.id}
                    name={account.name}
                    email={account.email}
                  />
                  <DeleteAccountButton
                    id={account.id}
                    label={account.name ?? account.email}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </Card>
    </Container>
  );
}
