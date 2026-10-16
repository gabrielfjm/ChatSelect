import { describe, expect, it } from "vitest";
import {
  firstFreeSlug,
  instrumentToContentRow,
  rowToRecord,
  type InstrumentRow,
} from "@/lib/catalog/instrument-row";

describe("firstFreeSlug", () => {
  it("keeps the base slug when free", () => {
    expect(firstFreeSlug("sus", new Set())).toBe("sus");
  });

  it("appends the first free numeric suffix", () => {
    expect(firstFreeSlug("sus", new Set(["sus", "sus-2"]))).toBe("sus-3");
  });
});

describe("row mapping", () => {
  it("round-trips the ficha content through the database row shape", () => {
    const content = {
      slug: "sus",
      sheetName: "SUS",
      title: "System Usability Scale (SUS)",
      authors: "Brooke, J.",
      originalLanguage: "Inglês",
      translations: null,
      description: "Escala de usabilidade.",
      instrumentLink: "https://example.org",
      instrumentType: "Questionário",
      instrumentDescription: null,
      category: "Usabilidade",
      qualityAttributes: null,
      attributes: null,
      communicationModalities: "Texto",
      originalSample: null,
      itemCount: "10 itens",
      responseFormat: null,
      scoring: null,
      reliability: null,
      referenceResult: null,
      advantages: ["Curto"],
      limitations: [],
      source: null,
      classification: "adapted" as const,
      isDualApplication: false,
    };
    const row: InstrumentRow = {
      ...instrumentToContentRow(content),
      id: "00000000-0000-0000-0000-000000000000",
      status: "approved",
      submitter_name: null,
      submitter_email: null,
      submitter_notes: null,
      review_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: "2026-10-16T00:00:00Z",
      updated_at: "2026-10-16T00:00:00Z",
    };
    expect(rowToRecord(row)).toMatchObject(content);
  });

  it("treats NULL arrays from the database as empty lists", () => {
    const record = rowToRecord({
      advantages: null,
      limitations: null,
    } as unknown as InstrumentRow);
    expect(record.advantages).toEqual([]);
    expect(record.limitations).toEqual([]);
  });
});
