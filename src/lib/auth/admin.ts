import "server-only";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { getAdminEmails } from "@/lib/supabase/env";
import { isAdminAuthUser } from "./admin-role";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

/** The signed-in user, admin or not. Uses getUser() (validated against
 * Supabase Auth) rather than the unverified session read from the cookie — so
 * promoting or removing an admin takes effect on their next request. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  if (error || !user?.email) return null;
  const name = user.user_metadata?.name;
  return {
    id: user.id,
    email: user.email.toLowerCase(),
    name: typeof name === "string" && name ? name : null,
    isAdmin: isAdminAuthUser(user, getAdminEmails()),
  };
}

/** For admin pages and Server Actions: every action re-checks on its own,
 * since Server Actions can be called directly without rendering the page. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/entrar");
  if (!user.isAdmin) redirect("/conta");
  return user;
}
