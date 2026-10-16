import { z } from "zod";
import type { Instrument } from "@/core/models/instrument";
import { detectDualApplication, slugify } from "@/core/models/instrument-text";

/**
 * Parses the instrument form (public /solicitar and the admin editor share
 * the same field names) from FormData into a validated `InstrumentInput`.
 * Pure — no database access — so it's unit tested directly.
 */

const MAX_SHORT = 300;
const MAX_LONG = 5000;

/** Trimmed text; empty becomes null so optional columns stay NULL. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .transform((value) => (value === "" ? null : value))
    .nullable();

/** Only http(s) links are accepted: instrumentLink is rendered as an
 * `href`, and the form is public, so a `javascript:` URL would be XSS. */
const optionalUrl = z
  .string()
  .trim()
  .max(MAX_SHORT, `Use no máximo ${MAX_SHORT} caracteres.`)
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Informe um link começando com http:// ou https://.",
  )
  .transform((value) => (value === "" ? null : value))
  .nullable();

/** One bullet per line ("Vantagens" / "Limitações"); leading "•", "-" or
 * "*" markers are stripped so pasted lists come out clean. */
const bulletList = z
  .string()
  .max(MAX_LONG, `Use no máximo ${MAX_LONG} caracteres.`)
  .transform((value) =>
    value
      .split(/\r?\n/)
      .map((line) => line.replace(/^\s*[•\-*]\s*/, "").trim())
      .filter(Boolean),
  );

const instrumentFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Preencha este campo obrigatório.")
    .max(MAX_SHORT, `Use no máximo ${MAX_SHORT} caracteres.`),
  sheetName: optionalText(80),
  slug: optionalText(80),
  authors: optionalText(MAX_LONG),
  originalLanguage: optionalText(MAX_SHORT),
  translations: optionalText(MAX_SHORT),
  description: optionalText(MAX_LONG),
  instrumentLink: optionalUrl,
  instrumentType: optionalText(MAX_SHORT),
  instrumentDescription: optionalText(MAX_LONG),
  category: optionalText(MAX_SHORT),
  qualityAttributes: optionalText(MAX_SHORT),
  attributes: optionalText(MAX_SHORT),
  communicationModalities: optionalText(MAX_SHORT),
  originalSample: optionalText(MAX_LONG),
  itemCount: optionalText(MAX_SHORT),
  responseFormat: optionalText(MAX_LONG),
  scoring: optionalText(MAX_LONG),
  reliability: optionalText(MAX_LONG),
  referenceResult: optionalText(MAX_LONG),
  advantages: bulletList,
  limitations: bulletList,
  source: optionalText(MAX_LONG),
  classification: z.enum(["adapted", "ad-hoc"], {
    error: "Escolha a classificação.",
  }),
});

const submitterSchema = z.object({
  submitterName: optionalText(MAX_SHORT),
  submitterEmail: z
    .string()
    .trim()
    .max(MAX_SHORT)
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Informe um e-mail válido.",
    )
    .transform((value) => (value === "" ? null : value))
    .nullable(),
  submitterNotes: optionalText(MAX_LONG),
});

export type InstrumentInput = Omit<Instrument, "slug"> & {
  /** Explicit slug typed by the admin; null → derived from sheetName/title. */
  slug: string | null;
};

export type SubmitterInput = z.infer<typeof submitterSchema>;

export type InstrumentFormField =
  | keyof z.input<typeof instrumentFieldsSchema>
  | keyof z.input<typeof submitterSchema>;

export type FieldErrors = Partial<Record<InstrumentFormField, string>>;

export type ParseResult<T> =
  { success: true; data: T } | { success: false; fieldErrors: FieldErrors };

const TEXT_FIELDS = Object.keys(instrumentFieldsSchema.shape).filter(
  (key) => key !== "classification",
);

function readForm(formData: FormData, keys: string[]) {
  const raw: Record<string, string | undefined> = {};
  for (const key of keys) {
    const value = formData.get(key);
    raw[key] = typeof value === "string" ? value : undefined;
  }
  return raw;
}

function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as InstrumentFormField | undefined;
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}

/** `requireDescription` is on for the public form: a request without any
 * description of what the instrument evaluates is useless to review. */
export function parseInstrumentForm(
  formData: FormData,
  options: { requireDescription?: boolean } = {},
): ParseResult<InstrumentInput> {
  const raw = readForm(formData, TEXT_FIELDS);
  const parsed = instrumentFieldsSchema.safeParse({
    ...Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, value ?? ""]),
    ),
    classification: formData.get("classification") ?? "adapted",
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const data = parsed.data;
  if (options.requireDescription && !data.description) {
    return {
      success: false,
      fieldErrors: { description: "Preencha este campo obrigatório." },
    };
  }

  const sheetName = data.sheetName ?? data.title;
  const slug = data.slug ? slugify(data.slug) : null;
  if (data.slug && !slug) {
    return {
      success: false,
      fieldErrors: { slug: "Use letras ou números no endereço da ficha." },
    };
  }

  return {
    success: true,
    data: {
      ...data,
      sheetName,
      slug,
      isDualApplication: detectDualApplication(data.instrumentDescription),
    },
  };
}

export function parseSubmitter(
  formData: FormData,
): ParseResult<SubmitterInput> {
  const raw = readForm(formData, Object.keys(submitterSchema.shape));
  const parsed = submitterSchema.safeParse(
    Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, value ?? ""]),
    ),
  );
  if (!parsed.success) {
    return { success: false, fieldErrors: toFieldErrors(parsed.error) };
  }
  return { success: true, data: parsed.data };
}

/** Slug the instrument would get, before de-duplication against the DB. */
export function baseSlugFor(input: InstrumentInput): string {
  return (
    input.slug ??
    (slugify(input.sheetName) || slugify(input.title) || "instrumento")
  );
}
