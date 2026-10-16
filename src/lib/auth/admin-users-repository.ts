import "server-only";
import type { User } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/service-client";
import { getAdminEmails } from "@/lib/supabase/env";
import { ADMIN_ROLE, isAdminAuthUser, isFixedAdmin } from "./admin-role";
import type { AdminUserInput } from "./admin-user-form";

/**
 * Administrator accounts live in Supabase Auth (no table of our own): the
 * admin flag is `app_metadata.role`, the display name is
 * `user_metadata.name`. Only call these after requireAdmin().
 */

export interface AdminAccount {
  id: string;
  email: string;
  name: string | null;
  /** In ADMIN_EMAILS — can't be deleted or have its e-mail changed here. */
  fixed: boolean;
  createdAt: string;
  lastSignInAt: string | null;
}

/** Message safe to show in the form (Supabase's own text is English). */
export class AdminAccountError extends Error {}

function toAccount(user: User, fixedEmails: ReadonlySet<string>): AdminAccount {
  const name = user.user_metadata?.name;
  return {
    id: user.id,
    email: (user.email ?? "").toLowerCase(),
    name: typeof name === "string" && name ? name : null,
    fixed: isFixedAdmin(user.email, fixedEmails),
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}

function translate(error: { message: string; code?: string }): never {
  const text = `${error.code ?? ""} ${error.message}`.toLowerCase();
  if (text.includes("already") || text.includes("exists")) {
    throw new AdminAccountError("Já existe um usuário com esse e-mail.");
  }
  if (text.includes("password") && text.includes("weak")) {
    throw new AdminAccountError(
      "Senha fraca demais. Use uma senha mais forte.",
    );
  }
  throw new Error(`[admin-users] ${error.message}`);
}

async function listAllUsers(): Promise<User[]> {
  const auth = createServiceClient().auth.admin;
  const users: User[] = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await auth.listUsers({ page, perPage: 1000 });
    if (error) translate(error);
    users.push(...data.users);
    if (data.users.length < 1000) return users;
  }
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const fixed = getAdminEmails();
  return (await listAllUsers())
    .filter((user) => isAdminAuthUser(user, fixed))
    .map((user) => toAccount(user, fixed))
    .sort((a, b) =>
      (a.name ?? a.email).localeCompare(b.name ?? b.email, "pt-BR"),
    );
}

export async function getAdminAccount(
  id: string,
): Promise<AdminAccount | null> {
  const { data, error } =
    await createServiceClient().auth.admin.getUserById(id);
  if (error || !data.user) return null;
  const fixed = getAdminEmails();
  return isAdminAuthUser(data.user, fixed) ? toAccount(data.user, fixed) : null;
}

export async function createAdminAccount(
  input: AdminUserInput & { password: string },
): Promise<AdminAccount> {
  const { data, error } = await createServiceClient().auth.admin.createUser({
    email: input.email,
    password: input.password,
    // Created by another admin, who vouches for the address — no
    // confirmation e-mail needed to log in.
    email_confirm: true,
    app_metadata: { role: ADMIN_ROLE },
    user_metadata: { name: input.name },
  });
  if (error) translate(error);
  return toAccount(data.user, getAdminEmails());
}

export async function updateAdminAccount(
  id: string,
  input: AdminUserInput,
): Promise<void> {
  const { error } = await createServiceClient().auth.admin.updateUserById(id, {
    email: input.email,
    email_confirm: true,
    ...(input.password ? { password: input.password } : {}),
    user_metadata: { name: input.name },
    // Fixed admins edited here also get the flag, so they stay admins even
    // if ADMIN_EMAILS changes later.
    app_metadata: { role: ADMIN_ROLE },
  });
  if (error) translate(error);
}

export async function deleteAdminAccount(id: string): Promise<void> {
  const { error } = await createServiceClient().auth.admin.deleteUser(id);
  if (error) translate(error);
}
