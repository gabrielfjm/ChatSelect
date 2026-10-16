import { describe, expect, it } from "vitest";
import { parseAdminUserForm } from "@/lib/auth/admin-user-form";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = {
  name: " Maria Faustino ",
  email: " Maria@Exemplo.com ",
  password: "senha-forte-123",
  passwordConfirm: "senha-forte-123",
};

describe("parseAdminUserForm", () => {
  it("trims the name and normalizes the e-mail", () => {
    const result = parseAdminUserForm(form(valid), { requirePassword: true });
    expect(result).toEqual({
      success: true,
      data: {
        name: "Maria Faustino",
        email: "maria@exemplo.com",
        password: "senha-forte-123",
      },
    });
  });

  it("requires name and a valid e-mail", () => {
    const result = parseAdminUserForm(
      form({ ...valid, name: " ", email: "nao-e-email" }),
      { requirePassword: true },
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.name).toBeDefined();
    expect(result.fieldErrors.email).toBeDefined();
  });

  it("requires a password on create but not on edit", () => {
    const blank = { ...valid, password: "", passwordConfirm: "" };
    expect(
      parseAdminUserForm(form(blank), { requirePassword: true }).success,
    ).toBe(false);
    const edit = parseAdminUserForm(form(blank), { requirePassword: false });
    expect(edit.success && edit.data.password).toBeNull();
  });

  it("enforces minimum length and matching confirmation", () => {
    const short = parseAdminUserForm(
      form({ ...valid, password: "curta", passwordConfirm: "curta" }),
      { requirePassword: true },
    );
    expect(!short.success && short.fieldErrors.password).toBeTruthy();

    const mismatch = parseAdminUserForm(
      form({ ...valid, passwordConfirm: "outra-senha-123" }),
      { requirePassword: false },
    );
    expect(
      !mismatch.success && mismatch.fieldErrors.passwordConfirm,
    ).toBeTruthy();
  });

  it("rejects passwords over 72 bytes (bcrypt limit)", () => {
    const long = "á".repeat(40); // 80 bytes in UTF-8
    const result = parseAdminUserForm(
      form({ ...valid, password: long, passwordConfirm: long }),
      { requirePassword: true },
    );
    expect(!result.success && result.fieldErrors.password).toBeTruthy();
  });
});
