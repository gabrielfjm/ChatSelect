"use server";

import { redirect } from "next/navigation";
import { isFixedAdmin } from "@/lib/auth/admin-role";
import {
  parseAdminUserForm,
  type AdminUserFieldErrors,
} from "@/lib/auth/admin-user-form";
import {
  AdminAccountError,
  createUserAccount,
} from "@/lib/auth/admin-users-repository";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { getAdminEmails } from "@/lib/supabase/env";

export interface SignUpFormState {
  status: "idle" | "error";
  fieldErrors?: AdminUserFieldErrors;
  message?: string;
}

/** Anyone can call this: it only ever creates an ordinary account, with no
 * access to the panel until an admin promotes it in /admin/contas. */
export async function signUp(
  _previous: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  // Honeypot: hidden from people, filled in by naive spam bots. Act as if it
  // worked so the bot has no signal to adapt to.
  if (String(formData.get("website") ?? "").trim() !== "") {
    redirect("/entrar");
  }

  const parsed = parseAdminUserForm(formData, { requirePassword: true });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.fieldErrors,
      message: "Revise os campos destacados.",
    };
  }
  const { name, email } = parsed.data;
  const password = parsed.data.password!;

  // E-mails in ADMIN_EMAILS are admins by address alone, and sign-up doesn't
  // prove ownership of the address: registering one here would grant admin.
  if (isFixedAdmin(email, getAdminEmails())) {
    return {
      status: "error",
      fieldErrors: { email: "Este e-mail não pode ser usado no cadastro." },
      message: "Revise os campos destacados.",
    };
  }

  try {
    await createUserAccount({ name, email, password });
  } catch (error) {
    if (error instanceof AdminAccountError) {
      return { status: "error", message: error.message };
    }
    console.error(error);
    return {
      status: "error",
      message: "Não foi possível criar a conta. Tente novamente em instantes.",
    };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // The account exists either way; only the automatic login failed.
  redirect(error ? "/entrar" : "/conta?criada=1");
}
