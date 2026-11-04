import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewAdminUserPage() {
  await requireAdmin();

  return (
    <Container className="max-w-2xl space-y-6 py-8">
      <Link
        href="/admin/administradores"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar aos administradores
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Novo administrador
        </h1>
        <p className="text-muted-foreground text-sm">
          A pessoa poderá entrar no painel com este e-mail e a senha inicial,
          com as mesmas permissões que você.
        </p>
      </div>
      <Card className="p-6">
        <AdminUserForm id={null} />
      </Card>
    </Container>
  );
}
