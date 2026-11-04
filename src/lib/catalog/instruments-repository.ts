import "server-only";
import { cache } from "react";
import type {
  Instrument,
  InstrumentRecord,
  InstrumentStatus,
} from "@/core/models/instrument";
import { createServiceClient } from "@/lib/supabase/service-client";
import {
  baseSlugFor,
  type InstrumentInput,
  type SubmitterInput,
} from "./instrument-form";
import {
  firstFreeSlug,
  instrumentToContentRow,
  rowToRecord,
  type InstrumentRow,
} from "./instrument-row";

/**
 * Only module that talks to the `instruments` table. Public pages go
 * through getAllInstruments()/getAdHocSlugs(), which only ever return
 * `approved` fichas; everything else is for the admin panel and must be
 * called after requireAdmin().
 */

const TABLE = "instruments";

function fail(action: string, error: { message: string }): never {
  throw new Error(`[instruments] Falha ao ${action}: ${error.message}`);
}

/** Published fichas only. Wrapped in React `cache` so the layout (header),
 * the page and generateMetadata share one query per request. */
export const getAllInstruments = cache(async (): Promise<Instrument[]> => {
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .select("*")
    .eq("status", "approved");
  if (error) fail("listar instrumentos publicados", error);
  return (data as InstrumentRow[]).map(rowToRecord).map(toPublicInstrument);
});

/** Slugs of published ad-hoc fichas — the header needs them to highlight
 * the right nav item on the shared /instrumentos/[slug] route. */
export async function getAdHocSlugs(): Promise<string[]> {
  const instruments = await getAllInstruments();
  return instruments
    .filter((instrument) => instrument.classification === "ad-hoc")
    .map((instrument) => instrument.slug);
}

/** Strips workflow fields (submitter e-mail etc.) before anything reaches
 * a public page. */
function toPublicInstrument(record: InstrumentRecord): Instrument {
  return {
    slug: record.slug,
    sheetName: record.sheetName,
    title: record.title,
    authors: record.authors,
    originalLanguage: record.originalLanguage,
    translations: record.translations,
    description: record.description,
    instrumentLink: record.instrumentLink,
    instrumentType: record.instrumentType,
    instrumentDescription: record.instrumentDescription,
    category: record.category,
    qualityAttributes: record.qualityAttributes,
    attributes: record.attributes,
    communicationModalities: record.communicationModalities,
    originalSample: record.originalSample,
    itemCount: record.itemCount,
    responseFormat: record.responseFormat,
    scoring: record.scoring,
    reliability: record.reliability,
    referenceResult: record.referenceResult,
    advantages: record.advantages,
    limitations: record.limitations,
    source: record.source,
    classification: record.classification,
    isDualApplication: record.isDualApplication,
  };
}

// ---------------------------------------------------------------------------
// Admin / moderation
// ---------------------------------------------------------------------------

export async function listInstrumentRecords(
  status: InstrumentStatus,
): Promise<InstrumentRecord[]> {
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .select("*")
    .eq("status", status)
    .order(status === "approved" ? "title" : "created_at", {
      ascending: status === "approved",
    });
  if (error) fail("listar registros", error);
  return (data as InstrumentRow[]).map(rowToRecord);
}

export async function countByStatus(): Promise<
  Record<InstrumentStatus, number>
> {
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .select("status");
  if (error) fail("contar registros", error);
  const counts: Record<InstrumentStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const row of data as Pick<InstrumentRow, "status">[]) {
    counts[row.status] += 1;
  }
  return counts;
}

export async function getInstrumentRecord(
  id: string,
): Promise<InstrumentRecord | null> {
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) fail("carregar registro", error);
  return data ? rowToRecord(data as InstrumentRow) : null;
}

/** Unique slug for `input`, ignoring the record being edited (so saving a
 * ficha without changing its name keeps its slug). */
async function resolveSlug(
  input: InstrumentInput,
  excludeId?: string,
): Promise<string> {
  const base = baseSlugFor(input);
  let query = createServiceClient()
    .from(TABLE)
    .select("slug")
    .like("slug", `${base}%`);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query;
  if (error) fail("verificar endereço da ficha", error);
  const taken = new Set((data as { slug: string }[]).map((row) => row.slug));
  return firstFreeSlug(base, taken);
}

function contentRow(input: InstrumentInput, slug: string) {
  return instrumentToContentRow({ ...input, slug });
}

/** Public request from /solicitar — always lands as `pending`. */
export async function createPendingInstrument(
  input: InstrumentInput,
  submitter: SubmitterInput,
): Promise<void> {
  const slug = await resolveSlug(input);
  const { error } = await createServiceClient()
    .from(TABLE)
    .insert({
      ...contentRow(input, slug),
      status: "pending",
      submitter_name: submitter.submitterName,
      submitter_email: submitter.submitterEmail,
      submitter_notes: submitter.submitterNotes,
    });
  if (error) fail("registrar solicitação", error);
}

export async function createInstrumentAsAdmin(
  input: InstrumentInput,
  status: InstrumentStatus,
  adminEmail: string,
): Promise<InstrumentRecord> {
  const slug = await resolveSlug(input);
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .insert({
      ...contentRow(input, slug),
      status,
      reviewed_by: status === "pending" ? null : adminEmail,
      reviewed_at: status === "pending" ? null : new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error) fail("criar instrumento", error);
  return rowToRecord(data as InstrumentRow);
}

export async function updateInstrument(
  id: string,
  input: InstrumentInput,
  reviewNotes: string | null,
): Promise<InstrumentRecord> {
  const slug = await resolveSlug(input, id);
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .update({ ...contentRow(input, slug), review_notes: reviewNotes })
    .eq("id", id)
    .select("*")
    .single();
  if (error) fail("salvar instrumento", error);
  return rowToRecord(data as InstrumentRow);
}

export async function setInstrumentStatus(
  id: string,
  status: InstrumentStatus,
  adminEmail: string,
): Promise<InstrumentRecord> {
  const { data, error } = await createServiceClient()
    .from(TABLE)
    .update({
      status,
      reviewed_by: adminEmail,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) fail("alterar status", error);
  return rowToRecord(data as InstrumentRow);
}

export async function deleteInstrument(id: string): Promise<void> {
  const { error } = await createServiceClient()
    .from(TABLE)
    .delete()
    .eq("id", id);
  if (error) fail("excluir instrumento", error);
}
