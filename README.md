# ChatSelect

> Catálogo de **instrumentos de avaliação** (questionários, escalas, entrevistas, rubricas) usados em pesquisas sobre **chatbots educacionais**.
>
> ⚠️ Este nome colide com outro projeto separado feito na mesma sessão (catálogo de **métodos** de avaliação, com Supabase, em `../chatselect`). São dois apps distintos que passaram a compartilhar o mesmo nome de marca a pedido do usuário.

ChatSelect ajuda pesquisadores a escolher qual instrumento usar para avaliar um chatbot educacional, navegando pelos instrumentos **Adaptado/Original** (derivam de uma fonte psicométrica validada, ex.: SUS, TAM) extraídos de artigos científicos. Instrumentos **Ad-hoc** (criados pelos próprios autores do estudo, sem validação psicométrica formal) ficam de fora da página inicial e da busca geral — eles têm uma aba própria, "Ad-hoc".

## Stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4** + **shadcn/ui**
- **Supabase** (Postgres + Auth): as fichas ficam no banco; o público envia solicitações e o admin aprova/edita/exclui em `/admin`
- **Zod** para validação
- **Vitest** para testes
- **Tradução nativa do navegador** (nenhuma dependência) — ver seção [Internacionalização](#internacionalização)

## Arquitetura

```
Supabase: tabela public.instruments (supabase/schema.sql)
  status = pending | approved | rejected
        │
        ▼
src/lib/catalog/instruments-repository.ts ← único ponto que acessa a tabela
        │                                   (páginas públicas só recebem `approved`)
        ▼
src/lib/catalog/catalog-service.ts        ← funções puras (busca, filtro, ordenação)
        │
        ▼
src/app/**                                ← páginas (View)
```

Todas as rotas são renderizadas por requisição (`dynamic = "force-dynamic"` no layout raiz), então uma ficha aprovada aparece no site na hora — sem novo deploy.

O CSV `data/Fichas_Instrumentos_Avaliacao.csv` continua no repositório, mas agora só como **carga inicial** do banco (`npm run db:seed`).

## Fluxo de solicitação e aprovação

1. Qualquer pessoa preenche a ficha em **`/solicitar`** (só nome e descrição são obrigatórios). O registro entra no banco com status `pending` e **não aparece no site**.
2. O admin entra em **`/admin`** (link "Área do administrador" no rodapé), vê as solicitações pendentes, completa/corrige os campos e clica em **Aprovar e publicar** → a ficha passa a aparecer no catálogo (ou em Ad Hoc, conforme a classificação).
3. Também no painel: **Rejeitar** (fica guardada, fora do site), **Despublicar** (volta para pendente), **Excluir** (definitivo) e **Novo instrumento** (o admin cadastra direto, publicado ou como rascunho).

## Administradores

Em **`/admin/administradores`** qualquer admin cadastra, edita (nome, e-mail, senha) e remove outros admins. Em **"Minha conta"** cada um troca a própria senha.

- As contas ficam no **Supabase Auth**. Quem é admin é marcado em `app_metadata.role = "admin"`, um campo que só o servidor (chave secreta) consegue gravar. Não há tabela própria para isso.
- Os e-mails em **`ADMIN_EMAILS`** são admins **fixos**: continuam admins mesmo sem a marcação, não podem ser removidos nem ter o e-mail trocado pelo painel. Servem de garantia de acesso caso todos os outros sejam removidos.
- Proteções: ninguém remove a própria conta e o último admin nunca é removido.
- Ao cadastrar alguém, o admin define uma **senha inicial** (há um botão "Gerar senha forte") e a passa para a pessoa por um canal seguro. Não há envio de e-mail.

Segurança:

- A tabela tem RLS ligado e nenhuma policy: a chave pública do Supabase não lê nem grava nada. Todo acesso passa pelo servidor do Next.js com a chave secreta (`SUPABASE_SERVICE_ROLE_KEY`, nunca enviada ao navegador).
- Admin = usuário do Supabase Auth com `app_metadata.role = "admin"` **ou** com e-mail em `ADMIN_EMAILS` (`src/lib/auth/admin-role.ts`). Cada página e cada Server Action do painel verifica isso de novo (`requireAdmin()` em `src/lib/auth/admin.ts`).
- O formulário público valida tudo no servidor (Zod, `src/lib/catalog/instrument-form.ts`), só aceita links `http(s)://` e tem um campo honeypot contra spam simples. O e-mail de quem enviou só aparece no painel.

## Instrumentos Adaptado/Original vs. Ad-hoc

- A **página inicial** (`/`) e sua busca/filtros mostram **apenas** instrumentos Adaptado/Original — ad-hoc nunca aparece lá, mesmo digitando um termo que daria match no título de um instrumento ad-hoc.
- A aba **Ad-hoc** (`/ad-hoc`) lista exclusivamente os instrumentos ad-hoc, sem busca/filtros.
- Essa restrição é aplicada em `src/app/page.tsx` (`filterByClassification(getAllInstruments(), "adapted")` antes de qualquer outro filtro) — não depende de nenhum parâmetro de URL, então não dá para "escapar" dela pela busca.

## Filtros da página inicial

Categoria, Idioma, Modalidade de comunicação, Atributos e Atributos de qualidade — cada um extrai suas opções dinamicamente dos valores presentes nos instrumentos Adaptado/Original (não do catálogo inteiro), para que nenhuma opção de filtro leve a uma lista vazia.

## Rodando localmente

```bash
npm install
npm run dev   # http://localhost:3000 (ou a próxima porta livre)
```

## Configurando o banco (uma vez)

1. Crie um projeto em [supabase.com](https://supabase.com) (o plano gratuito basta).
2. No **SQL Editor**, rode o conteúdo de `supabase/schema.sql`.
3. Copie `.env.example` para `.env.local` e preencha com os valores de **Project Settings → API** e os e-mails dos admins.
4. Em **Authentication → Users → Add user**, crie o usuário (e-mail + senha, marcando "Auto Confirm User") do admin listado em `ADMIN_EMAILS`. Os demais admins podem ser cadastrados depois pelo próprio painel. Desative "Allow new users to sign up" em **Authentication → Sign In / Providers** — o login do painel não precisa de cadastro aberto.
5. Rode `npm run db:seed` para importar as 41 fichas do CSV como publicadas.
6. Na Vercel, cadastre as mesmas 4 variáveis em **Settings → Environment Variables** e faça o deploy.

`npm run db:seed` só insere fichas cujo slug ainda não existe no banco — rodar de novo não apaga nem sobrescreve edições feitas no painel. Para forçar o conteúdo do CSV por cima do banco: `npm run db:seed -- --overwrite`.

## Como adicionar instrumentos

Pelo painel `/admin` (ou aprovando uma solicitação de `/solicitar`). Não é mais necessário editar CSV, HTML nem fazer deploy.

## Internacionalização

Português é o único idioma nativo — tanto a interface quanto os dados das 41 fichas de instrumentos. Não há nenhum widget de tradução no site (nem dicionários próprios, nem Google Translate embutido). A tradução é feita pelo **tradutor nativo do navegador**: Chrome, Edge e outros navegadores baseados em Chromium detectam automaticamente que a página está em português (via o atributo `lang="pt-BR"` na tag `<html>`, definido em `src/app/layout.tsx`) e, se o idioma do navegador for diferente, oferecem sozinhos o popup "Traduzir esta página?" na barra de endereço — sem nenhum código, script ou dependência externa no projeto.

Já testamos e descartamos duas alternativas nesta mesma base antes de chegar aqui: um i18n próprio com dicionários por idioma (bom resultado, mas complexo demais pra manter) e o widget clássico do Google Translate embutido na navbar (visualmente indesejado e desnecessário, já que a tradução nativa do navegador cobre o mesmo caso de uso sem nenhuma UI própria). Não há `<meta name="google" content="notranslate">` nem `translate="no"` em nenhum lugar do código, que bloqueariam essa detecção automática.

**Não foi possível verificar via `curl`** que o popup de tradução nativa aparece de fato (isso depende do motor de tradução do navegador, que só roda no cliente) — confirme manualmente abrindo o site em uma aba anônima com o idioma do navegador diferente de português.

## Scripts

| Script                 | Ação                                          |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento (precisa do `.env.local`) |
| `npm run build`         | Build de produção                             |
| `npm run db:seed`       | Importa o CSV para o banco (ver acima)        |
| `npm run typecheck`     | Checagem de tipos                             |
| `npm run lint`          | ESLint                                        |
| `npm run test`          | Testes (Vitest) — 54 testes, cobrindo o mapeamento CSV→Instrument, os filtros do catálogo, a validação dos formulários de ficha e de administrador, a regra de quem é admin e o mapeamento das linhas do banco |
| `npm run format`        | Prettier (escrita)                            |

## Deploy na Vercel

1. Suba o repositório para o GitHub.
2. Importe o repositório na Vercel (`vercel.json` já define `framework: nextjs`).
3. Cadastre as variáveis de `.env.example` em Settings → Environment Variables.
4. Deploy. O build não acessa o banco; as páginas leem o Supabase a cada requisição.
