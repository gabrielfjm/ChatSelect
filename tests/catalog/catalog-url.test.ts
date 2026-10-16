import { describe, expect, it } from "vitest";
import {
  currentListHref,
  hrefClearAll,
  hrefToggleFacet,
} from "@/lib/catalog/catalog-url";

describe("catalog URLs", () => {
  it("builds filter links on a plain path (public catalog)", () => {
    expect(
      hrefToggleFacet("/instrumentos", { q: "sus" }, "category", "Usabilidade"),
    ).toBe("/instrumentos?q=sus&category=Usabilidade");
    expect(currentListHref("/instrumentos", {})).toBe("/instrumentos");
  });

  it("keeps a base path's own query string (admin status tab)", () => {
    const base = "/admin?status=pending&tipo=ad-hoc";
    expect(hrefToggleFacet(base, {}, "category", "Aceitação")).toBe(
      "/admin?status=pending&tipo=ad-hoc&category=Aceita%C3%A7%C3%A3o",
    );
    // Unselecting the last facet goes back to the bare tab, no dangling "&".
    expect(
      hrefToggleFacet(
        base,
        { category: ["Aceitação"] },
        "category",
        "Aceitação",
      ),
    ).toBe(base);
    expect(hrefClearAll(base)).toBe(base);
  });
});
