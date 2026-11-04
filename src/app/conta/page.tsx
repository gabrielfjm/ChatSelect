import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Minha conta",
  robots: { index: false, follow: false },
};

/** Account page for ordinary users; admins have theirs inside the panel. */
export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ criada?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/entrar");
  if (user.isAdmin) redirect(`/admin/administradores/${user.id}`);
  const { criada } = await searchParams;

  return (
    <Container className="max-w-2xl space-y-6 py-8">
      <h1 className="text-2xl font-bold tracking-tight">Minha conta</h1>

      {criada === "1" && (
        <p
          role="status"
          className="rounded-md bg-emerald-100 px-4 py-2 text-sm text-emerald-900"
        >
          Conta criada. Você já está logado.
        </p>
      )}

      <Card className="space-y-4 p-6">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Nome</dt>
            <dd className="font-medium">{user.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Nível de acesso</dt>
            <dd className="font-medium">Usuário</dd>
          </div>
        </dl>
        <p className="text-muted-foreground text-sm">
          Sua conta ainda não tem acesso ao painel de administração. Quando um
          administrador liberar o acesso, o painel aparecerá no menu do site.
        </p>
      </Card>
    </Container>
  );
}
