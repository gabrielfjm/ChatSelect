import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { DeleteAdminButton } from "@/components/admin/delete-admin-button";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminAccount } from "@/lib/auth/admin-users-repository";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

/** Edit page for any admin — and "Minha conta" when it's the signed-in
 * admin's own id. */
export default async function EditAdminUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ criado?: string }>;
}) {
  const me = await requireAdmin();
  const { id } = await params;
  const { criado } = await searchParams;
  if (!UUID_PATTERN.test(id)) notFound();

  const account = await getAdminAccount(id);
  if (!account) notFound();
  const isSelf = account.id === me.id;

  return (
    <Container className="max-w-2xl space-y-6 py-8">
      {!isSelf && (
        <Link
          href="/admin/administradores"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar aos administradores
        </Link>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isSelf ? "Minha conta" : (account.name ?? account.email)}
        </h1>
        <p className="text-muted-foreground text-sm">
          Cadastrado em {dateFormat.format(new Date(account.createdAt))} ·{" "}
          {account.lastSignInAt
            ? `último acesso ${dateFormat.format(new Date(account.lastSignInAt))}`
            : "ainda não entrou"}
        </p>
      </div>

      {criado === "1" && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          Administrador cadastrado. Passe o e-mail e a senha inicial para a
          pessoa por um canal seguro.
        </p>
      )}

      <Card className="p-6">
        <AdminUserForm
          id={account.id}
          defaults={{ name: account.name, email: account.email }}
          emailLocked={account.fixed}
          isSelf={isSelf}
        />
      </Card>

      {!isSelf && (
        <Card className="space-y-3 p-6">
          <h2 className="font-semibold">Remover acesso</h2>
          {account.fixed ? (
            <p className="text-muted-foreground text-sm">
              Este administrador é fixo (<code>ADMIN_EMAILS</code>) e só pode
              ser removido na configuração do servidor.
            </p>
          ) : (
            <DeleteAdminButton
              id={account.id}
              label={account.name ?? account.email}
            />
          )}
        </Card>
      )}
    </Container>
  );
}
