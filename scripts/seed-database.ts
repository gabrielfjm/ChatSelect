/**
 * Imports data/Fichas_Instrumentos_Avaliacao.csv into the Supabase
 * `instruments` table as published (`approved`) fichas.
 *
 *   npm run db:seed                 → inserts fichas whose slug isn't in the
 *                                     database yet (never touches existing ones)
 *   npm run db:seed -- --overwrite  → also overwrites the content of existing
 *                                     fichas with what's in the CSV (discards
 *                                     edits made through the admin panel)
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from
 * .env.local (or the shell). Row -> Instrument mapping lives in
 * scripts/lib/csv-mapping.ts (pure, unit tested).
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import { instrumentSchema } from "../src/core/models/instrument";
import { instrumentToContentRow } from "../src/lib/catalog/instrument-row";
import { classify, mapRow, type CsvRow } from "./lib/csv-mapping";

const CSV_PATH = resolve(
  __dirname,
  "../data/Fichas_Instrumentos_Avaliacao.csv",
);
const ENV_PATH = resolve(__dirname, "../.env.local");

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `[db:seed] Variável ${name} não configurada (crie .env.local a partir de .env.example).`,
    );
    process.exit(1);
  }
  return value;
}

async function main() {
  if (existsSync(ENV_PATH)) process.loadEnvFile(ENV_PATH);
  const overwrite = process.argv.includes("--overwrite");

  const raw = readFileSync(CSV_PATH, "utf8").replace(/^﻿/, "");
  const rows: CsvRow[] = parse(raw, { columns: true, skip_empty_lines: true });
  const instruments = rows.map(mapRow);

  const parsed = instrumentSchema.array().safeParse(instruments);
  if (!parsed.success) {
    console.error("[db:seed] Validação do CSV falhou:");
    console.error(parsed.error.format());
    process.exit(1);
  }

  const slugs = new Set<string>();
  for (const instrument of instruments) {
    if (slugs.has(instrument.slug)) {
      console.error(
        `[db:seed] Slug duplicado: "${instrument.slug}" (${instrument.sheetName})`,
      );
      process.exit(1);
    }
    slugs.add(instrument.slug);
  }

  for (const row of rows) {
    if (classify(row).source === "text-heuristic") {
      console.warn(
        `[db:seed] ⚠ ${row.Nome_Aba} fora de known-classification.ts — estimado como "${classify(row).classification}", revise no painel admin.`,
      );
    }
  }

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("instruments")
    .upsert(
      instruments.map((instrument) => ({
        ...instrumentToContentRow(instrument),
        status: "approved",
        reviewed_by: "importação do CSV",
        reviewed_at: now,
      })),
      { onConflict: "slug", ignoreDuplicates: !overwrite },
    )
    .select("slug");

  if (error) {
    console.error(`[db:seed] Falha ao gravar no Supabase: ${error.message}`);
    process.exit(1);
  }

  console.log(
    `[db:seed] ${data.length} de ${instruments.length} fichas ${overwrite ? "gravadas" : "novas inseridas (as já existentes foram mantidas)"}.`,
  );
}

main();
