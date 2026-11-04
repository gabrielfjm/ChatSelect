import type {
  Instrument,
  InstrumentRecord,
  InstrumentStatus,
} from "@/core/models/instrument";

/**
 * snake_case row of the `instruments` table (supabase/schema.sql) and the
 * pure mapping to/from the camelCase domain model. Kept apart from the
 * repository so it can be shared with the seed script and unit tested.
 */
export interface InstrumentRow {
  id: string;
  slug: string;
  sheet_name: string;
  title: string;
  authors: string | null;
  original_language: string | null;
  translations: string | null;
  description: string | null;
  instrument_link: string | null;
  instrument_type: string | null;
  instrument_description: string | null;
  category: string | null;
  quality_attributes: string | null;
  attributes: string | null;
  communication_modalities: string | null;
  original_sample: string | null;
  item_count: string | null;
  response_format: string | null;
  scoring: string | null;
  reliability: string | null;
  reference_result: string | null;
  advantages: string[] | null;
  limitations: string[] | null;
  source: string | null;
  classification: "adapted" | "ad-hoc";
  is_dual_application: boolean;
  status: InstrumentStatus;
  submitter_name: string | null;
  submitter_email: string | null;
  submitter_notes: string | null;
  review_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Columns holding the ficha itself (everything but workflow metadata). */
export type InstrumentContentRow = Omit<
  InstrumentRow,
  | "id"
  | "status"
  | "submitter_name"
  | "submitter_email"
  | "submitter_notes"
  | "review_notes"
  | "reviewed_by"
  | "reviewed_at"
  | "created_at"
  | "updated_at"
>;

export function rowToRecord(row: InstrumentRow): InstrumentRecord {
  return {
    id: row.id,
    slug: row.slug,
    sheetName: row.sheet_name,
    title: row.title,
    authors: row.authors,
    originalLanguage: row.original_language,
    translations: row.translations,
    description: row.description,
    instrumentLink: row.instrument_link,
    instrumentType: row.instrument_type,
    instrumentDescription: row.instrument_description,
    category: row.category,
    qualityAttributes: row.quality_attributes,
    attributes: row.attributes,
    communicationModalities: row.communication_modalities,
    originalSample: row.original_sample,
    itemCount: row.item_count,
    responseFormat: row.response_format,
    scoring: row.scoring,
    reliability: row.reliability,
    referenceResult: row.reference_result,
    advantages: row.advantages ?? [],
    limitations: row.limitations ?? [],
    source: row.source,
    classification: row.classification,
    isDualApplication: row.is_dual_application,
    status: row.status,
    submitterName: row.submitter_name,
    submitterEmail: row.submitter_email,
    submitterNotes: row.submitter_notes,
    reviewNotes: row.review_notes,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function instrumentToContentRow(
  instrument: Instrument,
): InstrumentContentRow {
  return {
    slug: instrument.slug,
    sheet_name: instrument.sheetName,
    title: instrument.title,
    authors: instrument.authors,
    original_language: instrument.originalLanguage,
    translations: instrument.translations,
    description: instrument.description,
    instrument_link: instrument.instrumentLink,
    instrument_type: instrument.instrumentType,
    instrument_description: instrument.instrumentDescription,
    category: instrument.category,
    quality_attributes: instrument.qualityAttributes,
    attributes: instrument.attributes,
    communication_modalities: instrument.communicationModalities,
    original_sample: instrument.originalSample,
    item_count: instrument.itemCount,
    response_format: instrument.responseFormat,
    scoring: instrument.scoring,
    reliability: instrument.reliability,
    reference_result: instrument.referenceResult,
    advantages: instrument.advantages,
    limitations: instrument.limitations,
    source: instrument.source,
    classification: instrument.classification,
    is_dual_application: instrument.isDualApplication,
  };
}

/** Picks the first free slug: "sus", then "sus-2", "sus-3"… */
export function firstFreeSlug(base: string, taken: ReadonlySet<string>) {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}
