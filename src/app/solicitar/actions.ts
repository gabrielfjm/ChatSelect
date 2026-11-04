"use server";

import {
  parseInstrumentForm,
  parseSubmitter,
  type FieldErrors,
} from "@/lib/catalog/instrument-form";
import { createPendingInstrument } from "@/lib/catalog/instruments-repository";

export interface RequestFormState {
  status: "idle" | "success" | "error";
  fieldErrors?: FieldErrors;
  message?: string;
}

/** Anyone can call this: it only ever creates a `pending` record, which is
 * invisible on the site until an admin approves it in /admin. */
export async function submitInstrumentRequest(
  _previous: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  // Honeypot: hidden from people, filled in by naive spam bots. Pretend it
  // worked so the bot has no signal to adapt to.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const instrument = parseInstrumentForm(formData, {
    requireDescription: true,
  });
  const submitter = parseSubmitter(formData);
  if (!instrument.success || !submitter.success) {
    return {
      status: "error",
      fieldErrors: {
        ...(instrument.success ? {} : instrument.fieldErrors),
        ...(submitter.success ? {} : submitter.fieldErrors),
      },
      message: "Revise os campos destacados.",
    };
  }

  try {
    await createPendingInstrument(instrument.data, submitter.data);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message:
        "Não foi possível enviar sua solicitação. Tente novamente em instantes.",
    };
  }

  return { status: "success" };
}
