/**
 * Who counts as an admin. Pure (no Supabase calls) so it's unit tested and
 * shared by the login check, the session check and the admin-users list.
 *
 * - Accounts created in /admin/administradores carry
 *   `app_metadata.role = "admin"`. app_metadata can only be written with
 *   the service-role key, so a user can't grant it to themselves.
 * - E-mails in ADMIN_EMAILS are "fixed" admins: always admins, even
 *   without the flag. They're the way back in if every other admin is gone.
 */

export const ADMIN_ROLE = "admin";

export interface AuthUserLike {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
}

export function isFixedAdmin(
  email: string | null | undefined,
  fixedAdminEmails: ReadonlySet<string>,
): boolean {
  return Boolean(email) && fixedAdminEmails.has(email!.toLowerCase());
}

export function isAdminAuthUser(
  user: AuthUserLike,
  fixedAdminEmails: ReadonlySet<string>,
): boolean {
  return (
    user.app_metadata?.role === ADMIN_ROLE ||
    isFixedAdmin(user.email, fixedAdminEmails)
  );
}
