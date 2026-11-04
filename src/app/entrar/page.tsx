import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { getSessionUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.isAdmin ? "/admin" : "/conta");

  return (
    <Container className="flex max-w-md flex-col py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Entrar</CardTitle>
          <p className="text-muted-foreground text-sm">
            Use o e-mail e a senha da sua conta. Administradores são levados ao
            painel.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm />
          <p className="text-muted-foreground text-center text-sm">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="text-primary font-medium">
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
