import { describe, expect, it } from "vitest";
import {
  isAdminAuthUser,
  isFixedAdmin,
  isFixedAdminUser,
} from "@/lib/auth/admin-role";

const fixed = new Set(["dono@exemplo.com"]);

describe("isAdminAuthUser", () => {
  it("accepts users flagged with app_metadata.role = admin", () => {
    expect(
      isAdminAuthUser(
        { email: "x@exemplo.com", app_metadata: { role: "admin" } },
        fixed,
      ),
    ).toBe(true);
  });

  it("accepts fixed admins (ADMIN_EMAILS) without the flag, case-insensitively", () => {
    expect(isAdminAuthUser({ email: "Dono@Exemplo.com" }, fixed)).toBe(true);
    expect(isFixedAdmin("DONO@exemplo.com", fixed)).toBe(true);
  });

  it("doesn't treat self sign-ups as fixed admins, even with a listed e-mail", () => {
    const signedUp = {
      email: "dono@exemplo.com",
      app_metadata: { self_signup: true },
    };
    expect(isFixedAdminUser(signedUp, fixed)).toBe(false);
    expect(isAdminAuthUser(signedUp, fixed)).toBe(false);
  });

  it("accepts self sign-ups once promoted", () => {
    expect(
      isAdminAuthUser(
        {
          email: "x@exemplo.com",
          app_metadata: { self_signup: true, role: "admin" },
        },
        fixed,
      ),
    ).toBe(true);
  });

  it("rejects everyone else — including role set in user_metadata", () => {
    expect(isAdminAuthUser({ email: "x@exemplo.com" }, fixed)).toBe(false);
    expect(
      isAdminAuthUser(
        { email: "x@exemplo.com", app_metadata: { role: "editor" } },
        fixed,
      ),
    ).toBe(false);
    expect(
      isAdminAuthUser(
        {
          email: "x@exemplo.com",
          // user_metadata is user-writable, so it must never grant access.
          ...({ user_metadata: { role: "admin" } } as object),
        },
        fixed,
      ),
    ).toBe(false);
    expect(isAdminAuthUser({ email: null }, fixed)).toBe(false);
  });
});
