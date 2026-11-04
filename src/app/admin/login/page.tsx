import { redirect } from "next/navigation";

/** The login moved to /entrar now that it isn't admin-only; keeps old links
 * working. */
export default function AdminLoginPage() {
  redirect("/entrar");
}
