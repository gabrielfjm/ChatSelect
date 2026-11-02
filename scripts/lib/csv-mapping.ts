/**
 * Pure CSV-row -> Instrument mapping logic, kept separate from
 * build-catalog.ts (which does file I/O) so it can be unit tested without
 * triggering the ingestion script's side effects on import.
 */
import type { Instrument } from "../../src/core/models/instrument";
import {
  KNOWN_ADAPTED_SHEET_NAMES,
  KNOWN_AD_HOC_SHEET_NAMES,
} from "../../src/core/models/known-classification";

export interface CsvRow {
  Nome_Aba: string;
  Título: string;
  Autores: string;
  "Idioma Original": string;
  Traduções: string;
  Descrição: string;
  "Link do instrumento": string;
  Instrumento: string;
  "Descrição do instrumento": string;
  "Foco da avaliação": string;
  "Perspectiva de qualidade": string;
  "Atributo de qualidade": string;
  "Modalidades de comunicação": string;
  "Amostra de validação do instrumento": string;
  "Número de itens": string;
  "Formato de resposta": string;
  "Como pontuar": string;
  Confiabilidade: string;
  "Resultado de referência": string;
  Vantagens: string;
  Limitações: string;
  Fonte: string;
}

export function nullIfEmpty(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** "•  A | •  B" -> ["A", "B"] */
export function splitBullets(value: string | undefined): string[] {
  const trimmed = value?.trim();
  if (!trimmed) return [];
  return trimmed
    .split("|")
    .map((item) =>
      item
        .trim()
        .replace(/^[••]\s*/, "")
        .trim(),
    )
    .filter(Boolean);
}

export function slugify(sheetName: string): string {
  return sheetName
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const KNOWN_ADAPTED = new Set<string>(KNOWN_ADAPTED_SHEET_NAMES);
const KNOWN_AD_HOC = new Set<string>(KNOWN_AD_HOC_SHEET_NAMES);

/** Text-only heuristic (case-insensitive "ad-hoc" / "ad hoc" substring).
 * Kept only as a fallback for instruments that aren't in the curated fixed
 * list yet — see `classify` below for why it isn't the primary signal. */
export function detectClassificationFromText(
  row: CsvRow,
): "adapted" | "ad-hoc" {
  const haystack = [
    row.Instrumento,
    row["Descrição do instrumento"],
    row.Traduções,
    row.Confiabilidade,
    row.Limitações,
  ]
    .join(" ")
    .toLowerCase();
  return /ad[\s-]hoc/.test(haystack) ? "ad-hoc" : "adapted";
}

/**
 * The curated fixed list (defined by the research team) reflects a
 * richer judgment than a text substring can: some ad-hoc instruments never
 * literally say "ad-hoc" (e.g. Heuristic_Set_Chatbots), and some
 * adapted/original ones mention "ad hoc" only in passing about a reduced
 * version used in one application (e.g. CHISM, WFC-SES). So the
 * fixed list is authoritative for the 41 known sheets; text detection is
 * only a heuristic guess for instruments added later that aren't in it yet.
 */
export function classify(row: CsvRow): {
  classification: "adapted" | "ad-hoc";
  source: "known-list" | "text-heuristic";
} {
  if (KNOWN_ADAPTED.has(row.Nome_Aba))
    return { classification: "adapted", source: "known-list" };
  if (KNOWN_AD_HOC.has(row.Nome_Aba))
    return { classification: "ad-hoc", source: "known-list" };
  return {
    classification: detectClassificationFromText(row),
    source: "text-heuristic",
  };
}

export function isDualApplication(row: CsvRow): boolean {
  const text = row["Descrição do instrumento"] ?? "";
  return /aplicaç[ãa]o 1/i.test(text) && /aplicaç[ãa]o 2/i.test(text);
}

export function mapRow(row: CsvRow): Instrument {
  return {
    slug: slugify(row.Nome_Aba),
    sheetName: row.Nome_Aba,
    title: row.Título,
    authors: nullIfEmpty(row.Autores),
    originalLanguage: nullIfEmpty(row["Idioma Original"]),
    translations: nullIfEmpty(row.Traduções),
    description: nullIfEmpty(row.Descrição),
    instrumentLink: nullIfEmpty(row["Link do instrumento"]),
    instrumentType: nullIfEmpty(row.Instrumento),
    instrumentDescription: nullIfEmpty(row["Descrição do instrumento"]),
    category: nullIfEmpty(row["Foco da avaliação"]),
    qualityAttributes: nullIfEmpty(row["Perspectiva de qualidade"]),
    attributes: nullIfEmpty(row["Atributo de qualidade"]),
    communicationModalities: nullIfEmpty(row["Modalidades de comunicação"]),
    originalSample: nullIfEmpty(row["Amostra de validação do instrumento"]),
    itemCount: nullIfEmpty(row["Número de itens"]),
    responseFormat: nullIfEmpty(row["Formato de resposta"]),
    scoring: nullIfEmpty(row["Como pontuar"]),
    reliability: nullIfEmpty(row.Confiabilidade),
    referenceResult: nullIfEmpty(row["Resultado de referência"]),
    advantages: splitBullets(row.Vantagens),
    limitations: splitBullets(row.Limitações),
    source: nullIfEmpty(row.Fonte),
    classification: classify(row).classification,
    isDualApplication: isDualApplication(row),
  };
}
