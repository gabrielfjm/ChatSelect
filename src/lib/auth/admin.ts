import "server-only";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { getAdminEmails } from "@/lib/supabase/env";
import { isAdminAuthUser } from "./admin-role";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

/** The signed-in user, if (and only if) they are an admin (see
 * admin-role.ts). Uses getUser() (validated against Supabase Auth) rather
 * than the unverified session read from the cookie — so an admin who was
 * removed loses access on their next request. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  if (error || !user?.email) return null;
  if (!isAdminAuthUser(user, getAdminEmails())) return null;
  const name = user.user_metadata?.name;
  return {
    id: user.id,
    email: user.email.toLowerCase(),
    name: typeof name === "string" && name ? name : null,
  };
}

/** For admin pages and Server Actions: every action re-checks on its own,
 * since Server Actions can be called directly without rendering the page. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
