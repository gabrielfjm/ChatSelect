import { describe, expect, it } from "vitest";
import {
  classify,
  isDualApplication,
  mapRow,
  nullIfEmpty,
  slugify,
  splitBullets,
  type CsvRow,
} from "../../scripts/lib/csv-mapping";

function buildRow(overrides: Partial<CsvRow> = {}): CsvRow {
  return {
    Nome_Aba: "SUS",
    Título: "System Usability Scale (SUS)",
    Autores: "Brooke, J. (1996).",
    "Idioma Original": "Inglês",
    Traduções: "Espanhol, Francês",
    Descrição: "Escala padronizada de usabilidade.",
    "Link do instrumento": "https://example.org/sus",
    Instrumento: "Questionário (10 itens)",
    "Descrição do instrumento": "10 afirmações com tom alternado.",
    "Foco da avaliação": "Usability",
    "Perspectiva de qualidade": "Product Quality",
    "Atributo de qualidade": "Usability",
    "Modalidades de comunicação": "Text",
    "Amostra de validação do instrumento": "Não há amostra formal.",
    "Número de itens": "10 itens",
    "Formato de resposta": "Escala Likert de 5 pontos",
    "Como pontuar": "Soma dos itens.",
    Confiabilidade: "Correlações fortes entre itens.",
    "Resultado de referência": "Benchmark de 68 pontos.",
    Vantagens: "•  Rápido de aplicar. | •  Amplamente citado.",
    Limitações: "•  Genérico, não cobre chatbots.",
    Fonte: "Fonte: Brooke, J. (1996). https://example.org/sus",
    ...overrides,
  };
}

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("CEQ-28")).toBe("ceq-28");
  });

  it("converts + to -plus", () => {
    expect(slugify("MEEGA+")).toBe("meega-plus");
  });

  it("strips accents", () => {
    expect(slugify("Não_encontrado")).toBe("nao-encontrado");
  });
});

describe("splitBullets", () => {
  it("splits on | and strips bullet markers", () => {
    expect(splitBullets("•  A | •  B")).toEqual(["A", "B"]);
  });

  it("returns an empty array for blank input", () => {
    expect(splitBullets("")).toEqual([]);
    expect(splitBullets(undefined)).toEqual([]);
  });
});

describe("nullIfEmpty", () => {
  it("treats whitespace-only strings as null", () => {
    expect(nullIfEmpty("   ")).toBeNull();
    expect(nullIfEmpty("")).toBeNull();
  });

  it("trims and keeps real content", () => {
    expect(nullIfEmpty("  texto  ")).toBe("texto");
  });
});

describe("isDualApplication", () => {
  it("detects the Aplicação 1 / Aplicação 2 pattern", () => {
    const row = buildRow({
      "Descrição do instrumento": "Aplicação 1 (...) Aplicação 2 (...)",
    });
    expect(isDualApplication(row)).toBe(true);
  });

  it("returns false for a normal single-application ficha", () => {
    expect(isDualApplication(buildRow())).toBe(false);
  });
});

describe("classify", () => {
  it("trusts the known fixed list over text content (adapted)", () => {
    // SUS is on the known "adapted" list and its text never says "ad hoc".
    const result = classify(buildRow({ Nome_Aba: "SUS" }));
    expect(result).toEqual({ classification: "adapted", source: "known-list" });
  });

  it("trusts the known fixed list over text content (ad-hoc)", () => {
    // Heuristic_Set_Chatbots is ad-hoc per the fixed list even though its
    // ficha text never contains the literal string "ad hoc".
    const result = classify(buildRow({ Nome_Aba: "Heuristic_Set_Chatbots" }));
    expect(result).toEqual({ classification: "ad-hoc", source: "known-list" });
  });

  it("falls back to text heuristic for instruments outside the known list", () => {
    const adHoc = classify(
      buildRow({
        Nome_Aba: "Brand_New_Instrument",
        Limitações: "•  Instrumento ad-hoc, sem validação formal.",
      }),
    );
    expect(adHoc).toEqual({
      classification: "ad-hoc",
      source: "text-heuristic",
    });

    const adapted = classify(buildRow({ Nome_Aba: "Brand_New_Instrument" }));
    expect(adapted).toEqual({
      classification: "adapted",
      source: "text-heuristic",
    });
  });
});

describe("mapRow", () => {
  it("maps a CSV row to the Instrument domain shape", () => {
    const instrument = mapRow(buildRow());

    expect(instrument).toMatchObject({
      slug: "sus",
      sheetName: "SUS",
      title: "System Usability Scale (SUS)",
      classification: "adapted",
      isDualApplication: false,
    });
    expect(instrument.advantages).toEqual([
      "Rápido de aplicar.",
      "Amplamente citado.",
    ]);
    expect(instrument.limitations).toEqual(["Genérico, não cobre chatbots."]);
  });
});
