import { z } from "zod";

/**
 * Domain shape for one instrument card ("ficha"). Field names are English
 * translations of the original CSV column labels (the CSV is still the seed
 * for the database — see scripts/seed-database.ts).
 */
export const instrumentSchema = z.object({
  slug: z.string(),
  sheetName: z.string(),
  title: z.string(),
  authors: z.string().nullable(),
  originalLanguage: z.string().nullable(),
  translations: z.string().nullable(),
  description: z.string().nullable(),
  instrumentLink: z.string().nullable(),
  instrumentType: z.string().nullable(),
  instrumentDescription: z.string().nullable(),
  category: z.string().nullable(),
  qualityAttributes: z.string().nullable(),
  attributes: z.string().nullable(),
  communicationModalities: z.string().nullable(),
  originalSample: z.string().nullable(),
  itemCount: z.string().nullable(),
  responseFormat: z.string().nullable(),
  scoring: z.string().nullable(),
  reliability: z.string().nullable(),
  referenceResult: z.string().nullable(),
  advantages: z.array(z.string()),
  limitations: z.array(z.string()),
  source: z.string().nullable(),
  classification: z.enum(["adapted", "ad-hoc"]),
  isDualApplication: z.boolean(),
});

export type Instrument = z.infer<typeof instrumentSchema>;

export const INSTRUMENT_STATUSES = ["pending", "approved", "rejected"] as const;
export type InstrumentStatus = (typeof INSTRUMENT_STATUSES)[number];

/** An instrument as stored in the database, including the moderation
 * workflow fields. Only `approved` records are ever shown on the public
 * site; `pending` ones come from the public /solicitar form. */
export interface InstrumentRecord extends Instrument {
  id: string;
  status: InstrumentStatus;
  submitterName: string | null;
  submitterEmail: string | null;
  submitterNotes: string | null;
  reviewNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
