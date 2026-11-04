import { Card, CardContent } from "@/components/ui/card";

export function DualApplicationNotice() {
  return (
    <Card className="border-amber-500/40 bg-amber-500/10">
      <CardContent className="pt-6 text-sm">
        <p className="font-medium">Esta ficha documenta duas aplicações</p>
        <p className="text-muted-foreground">
          Os dados abaixo (autores, amostra, confiabilidade, vantagens e
          limitações) descrevem dois instrumentos ad-hoc distintos, criados por
          equipes de pesquisa diferentes, agrupados nesta ficha porque a
          planilha-fonte os documenta em conjunto. Consulte o texto das seções
          &ldquo;Descrição do instrumento&rdquo; e &ldquo;Fonte&rdquo; para
          distinguir Aplicação 1 de Aplicação 2.
        </p>
      </CardContent>
    </Card>
  );
}
