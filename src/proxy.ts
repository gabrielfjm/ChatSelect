import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Keeps the admin's Supabase Auth session fresh: Server Components can't
 * write cookies, so an expired access token is refreshed here before any
 * page renders (the header shows the login state everywhere).
 * Authorization itself is NOT decided here — every admin page and Server
 * Action calls requireAdmin() (src/lib/auth/admin.ts).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // No auth cookie → nothing to refresh; skip the network round trip for
  // regular visitors.
  if (request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) {
    await supabase.auth.getUser();
  }
  return response;
}

export const config = {
  // Every page, but not Next.js assets or static files from public/.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf)$).*)",
  ],
};
