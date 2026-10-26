/** Per-category color assignments so Foco da avaliação tags are visually
 * distinguishable at a glance instead of all sharing the same light-blue
 * tint. Keyed by the exact Portuguese category string from the CSV. Same
 * colors back both the solid tag/pill (cards, instrument sidebar) and the
 * checked state of the category filter checkbox. */
const CATEGORY_COLORS: Record<string, string> = {
  "Experiência do Usuário": "border-[#2563EB] bg-[#2563EB] text-white",
  Usabilidade: "border-[#16A34A] bg-[#16A34A] text-white",
  Aceitação: "border-[#EA580C] bg-[#EA580C] text-white",
  "Impacto Psicológico": "border-[#7C3AED] bg-[#7C3AED] text-white",
  "Qualidade das Respostas": "border-[#B91C1C] bg-[#B91C1C] text-white",
};

const DEFAULT_COLOR = "border-primary bg-primary text-primary-foreground";

/** Solid border+background+text classes for a category. */
export function categorySolidClasses(category: string | null | undefined) {
  return (category && CATEGORY_COLORS[category]) || DEFAULT_COLOR;
}
