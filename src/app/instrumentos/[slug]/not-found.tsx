import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function InstrumentNotFound() {
  return (
    <Container className="space-y-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Instrumento não encontrado</h1>
      <p className="text-muted-foreground text-sm">
        O instrumento que você procura não existe ou foi removido do catálogo.
      </p>
      <Button asChild>
        <Link href="/instrumentos">Voltar aos instrumentos</Link>
      </Button>
    </Container>
  );
}
