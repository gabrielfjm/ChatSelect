# Versão congelada para a coleta do TAM

## Hash

```
5b99fee32b969116ca327dbe0a3c8f18b6538729
```

Data/hora do commit: **2026-09-28T21:57:14-03:00**.
Publicado em `origin/master` (deploy de produção em `chat-select.vercel.app`) nesta mesma janela.

## O que entrou nesta rodada

- Destaque correto do header nas fichas de instrumentos ad hoc: `/instrumentos/[slug]` é uma rota compartilhada entre instrumentos validados e ad hoc, e o header agora resolve a seção ativa pela classificação real do instrumento (`AD_HOC_SLUGS`), não só pelo prefixo da URL. Inclui `aria-current="page"` no link ativo (desktop e mobile).
- Texto dos cinco filtros na home: a seção "Como Funciona" agora cita os cinco filtros reais do catálogo (foco da avaliação, idioma, modalidade de comunicação, atributo de qualidade, perspectiva de qualidade), na mesma ordem em que aparecem em `filter-sidebar.tsx`.

## Fila pós-coleta (não entra em produção antes do fim da coleta)

- **Listagem do catálogo renderizada no cliente**: avaliar se `/instrumentos` e `/ad-hoc` (hoje dinâmicas/server-rendered a cada request) podem virar geração estática.
- **Revisão da Seção 4.4.2 da dissertação**: o texto afirma que não há coleta de dados de usuários, mas o formulário `/solicitar` coleta e-mail (opcional) e envia ao Formspree — precisa decidir se a seção é reescrita ou se o formulário muda.
- **Decisão sobre o campo de e-mail e o aviso do Formspree**: nesta rodada o aviso de privacidade foi implementado e depois revertido por decisão explícita; falta uma decisão final sobre manter/remover o campo de e-mail e se/como avisar sobre o Formspree.
- **Correções de fichas vindas do protocolo de verificação**: pendente de levantamento próprio, fora do escopo desta rodada.

## Regra até o fim da coleta

Nada entra em `master` até o fim da coleta do TAM. Qualquer mudança de código fica em branch separada, sem merge nem push para `origin/master`, até liberação explícita.
