import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "@/components/account/sign-up-form";
import { getSessionUser } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  if (await getSessionUser()) redirect("/conta");

  return (
    <Container className="flex max-w-md flex-col py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Criar conta</CardTitle>
          <p className="text-muted-foreground text-sm">
            O acesso ao painel de administração depende da liberação de um
            administrador.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
          <p className="text-muted-foreground text-center text-sm">
            Já tem conta?{" "}
            <Link href="/entrar" className="text-primary font-medium">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </Container>
  );
}
