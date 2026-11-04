import { describe, expect, it } from "vitest";
import {
  baseSlugFor,
  parseInstrumentForm,
  parseSubmitter,
} from "@/lib/catalog/instrument-form";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("parseInstrumentForm", () => {
  it("trims text, turns empty fields into null and defaults classification", () => {
    const result = parseInstrumentForm(
      form({ title: "  System Usability Scale  ", authors: "   " }),
    );
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.title).toBe("System Usability Scale");
    expect(result.data.authors).toBeNull();
    expect(result.data.classification).toBe("adapted");
    expect(result.data.sheetName).toBe("System Usability Scale");
  });

  it("requires a title", () => {
    const result = parseInstrumentForm(form({ title: " " }));
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.title).toBeDefined();
  });

  it("requires a description only when asked to (public form)", () => {
    expect(parseInstrumentForm(form({ title: "SUS" })).success).toBe(true);
    const result = parseInstrumentForm(form({ title: "SUS" }), {
      requireDescription: true,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.description).toBeDefined();
  });

  it("rejects non-http links (would be XSS as an href)", () => {
    const result = parseInstrumentForm(
      form({ title: "SUS", instrumentLink: "javascript:alert(1)" }),
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.instrumentLink).toBeDefined();

    const ok = parseInstrumentForm(
      form({ title: "SUS", instrumentLink: "https://doi.org/10.1/x" }),
    );
    expect(ok.success && ok.data.instrumentLink).toBe("https://doi.org/10.1/x");
  });

  it("rejects an unknown classification", () => {
    const result = parseInstrumentForm(
      form({ title: "SUS", classification: "validated" }),
    );
    expect(result.success).toBe(false);
  });

  it("splits advantages/limitations one per line, stripping bullet markers", () => {
    const result = parseInstrumentForm(
      form({
        title: "SUS",
        advantages: "• Curto\r\n\n- Validado\n* Gratuito",
        limitations: "",
      }),
    );
    expect(result.success && result.data.advantages).toEqual([
      "Curto",
      "Validado",
      "Gratuito",
    ]);
    expect(result.success && result.data.limitations).toEqual([]);
  });

  it("detects dual application from the instrument description", () => {
    const result = parseInstrumentForm(
      form({
        title: "X",
        instrumentDescription:
          "Aplicação 1: pré-teste. Aplicação 2: pós-teste.",
      }),
    );
    expect(result.success && result.data.isDualApplication).toBe(true);
  });

  it("normalizes an explicit slug and derives one otherwise", () => {
    const explicit = parseInstrumentForm(
      form({ title: "X", slug: "Meu SUS!" }),
    );
    expect(explicit.success && baseSlugFor(explicit.data)).toBe("meu-sus");

    const derived = parseInstrumentForm(
      form({ title: "System Usability Scale", sheetName: "MEEGA+" }),
    );
    expect(derived.success && baseSlugFor(derived.data)).toBe("meega-plus");

    const nonLatin = parseInstrumentForm(form({ title: "问卷" }));
    expect(nonLatin.success && baseSlugFor(nonLatin.data)).toBe("instrumento");
  });
});

describe("parseSubmitter", () => {
  it("accepts an empty submitter", () => {
    const result = parseSubmitter(form({}));
    expect(result).toEqual({
      success: true,
      data: { submitterName: null, submitterEmail: null, submitterNotes: null },
    });
  });

  it("rejects an invalid e-mail", () => {
    const result = parseSubmitter(form({ submitterEmail: "não-é-email" }));
    expect(result.success).toBe(false);
  });
});
