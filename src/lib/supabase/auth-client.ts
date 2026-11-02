import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Supabase client bound to the request cookies — used only for the admin
 * login session (Supabase Auth), never for reading/writing instruments.
 * Server Components can't write cookies, so `setAll` failures there are
 * ignored; src/proxy.ts refreshes the session before /admin renders.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — the proxy handles the refresh.
        }
      },
    },
  });
}
