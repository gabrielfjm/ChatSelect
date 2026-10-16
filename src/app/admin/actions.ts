"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  INSTRUMENT_STATUSES,
  type InstrumentStatus,
} from "@/core/models/instrument";
import { requireAdmin } from "@/lib/auth/admin";
import { isAdminAuthUser } from "@/lib/auth/admin-role";
import {
  parseInstrumentForm,
  type FieldErrors,
} from "@/lib/catalog/instrument-form";
import {
  createInstrumentAsAdmin,
  deleteInstrument,
  setInstrumentStatus,
  updateInstrument,
} from "@/lib/catalog/instruments-repository";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { getAdminEmails } from "@/lib/supabase/env";

/**
 * Every action here calls requireAdmin() itself: Server Actions are public
 * POST endpoints, so being rendered only on admin pages protects nothing.
 */

/** Public pages read the catalog per request, but the client router cache
 * may still hold old renders — this drops them after any change. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function parseStatus(value: FormDataEntryValue | null): InstrumentStatus {
  return INSTRUMENT_STATUSES.includes(value as InstrumentStatus)
    ? (value as InstrumentStatus)
    : "pending";
}

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------

export interface LoginState {
  error?: string;
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Informe e-mail e senha." };

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: "E-mail ou senha incorretos." };

  if (!isAdminAuthUser(data.user, getAdminEmails())) {
    await supabase.auth.signOut();
    return { error: "Este usuário não tem permissão de administrador." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  // The header shows the login state on every page.
  revalidatePath("/", "layout");
  redirect("/");
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export interface InstrumentFormState {
  status: "idle" | "saved" | "error";
  fieldErrors?: FieldErrors;
  message?: string;
}

/** Create (id = null) or update. Bound with `.bind(null, id)` by the form. */
export async function saveInstrument(
  id: string | null,
  _previous: InstrumentFormState,
  formData: FormData,
): Promise<InstrumentFormState> {
  const admin = await requireAdmin();

  const parsed = parseInstrumentForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.fieldErrors,
      message: "Revise os campos destacados.",
    };
  }

  let savedId: string;
  try {
    if (id) {
      const reviewNotes = String(formData.get("reviewNotes") ?? "").trim();
      await updateInstrument(id, parsed.data, reviewNotes || null);
      savedId = id;
    } else {
      const created = await createInstrumentAsAdmin(
        parsed.data,
        parseStatus(formData.get("status")),
        admin.email,
      );
      savedId = created.id;
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Não foi possível salvar. Tente de novo.",
    };
  }

  refreshSite();
  if (!id) redirect(`/admin/instrumentos/${savedId}?criado=1`);
  return { status: "saved", message: "Alterações salvas." };
}

export async function changeStatus(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const status = parseStatus(formData.get("status"));
  await setInstrumentStatus(id, status, admin.email);
  refreshSite();
  revalidatePath(`/admin/instrumentos/${id}`);
}

export async function removeInstrument(id: string) {
  await requireAdmin();
  await deleteInstrument(id);
  refreshSite();
  redirect("/admin?excluido=1");
}
