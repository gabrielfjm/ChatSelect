/**
 * Who counts as an admin. Pure (no Supabase calls) so it's unit tested and
 * shared by the login check, the session check and the admin-users list.
 *
 * - Accounts created in /admin/administradores carry
 *   `app_metadata.role = "admin"`. app_metadata can only be written with
 *   the service-role key, so a user can't grant it to themselves.
 * - E-mails in ADMIN_EMAILS are "fixed" admins: always admins, even
 *   without the flag. They're the way back in if every other admin is gone.
 * - Accounts from the public sign-up carry `app_metadata.self_signup = true`
 *   and never count as fixed admins: sign-up doesn't prove ownership of the
 *   address, so matching ADMIN_EMAILS (even if it's added there later) can't
 *   be what grants them access. They only become admins by being promoted.
 */

export const ADMIN_ROLE = "admin";
export const SELF_SIGNUP_FLAG = "self_signup";

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

export function isFixedAdminUser(
  user: AuthUserLike,
  fixedAdminEmails: ReadonlySet<string>,
): boolean {
  return (
    user.app_metadata?.[SELF_SIGNUP_FLAG] !== true &&
    isFixedAdmin(user.email, fixedAdminEmails)
  );
}

export function isAdminAuthUser(
  user: AuthUserLike,
  fixedAdminEmails: ReadonlySet<string>,
): boolean {
  return (
    user.app_metadata?.role === ADMIN_ROLE ||
    isFixedAdminUser(user, fixedAdminEmails)
  );
}
