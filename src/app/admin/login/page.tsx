import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Entrar — Administração",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");

  return (
    <Container className="flex max-w-md flex-col py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Área do administrador</CardTitle>
          <p className="text-muted-foreground text-sm">
            Entre para revisar solicitações e editar o catálogo.
          </p>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </Container>
  );
}
