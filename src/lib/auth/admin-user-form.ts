import { z } from "zod";

/** Validation for the create/edit administrator form. Pure — unit tested. */

const MIN_PASSWORD = 8;
// Supabase Auth (bcrypt) ignores anything past 72 bytes.
const MAX_PASSWORD = 72;

export type AdminUserField = "name" | "email" | "password" | "passwordConfirm";
export type AdminUserFieldErrors = Partial<Record<AdminUserField, string>>;

export interface AdminUserInput {
  name: string;
  email: string;
  /** null on edit when the password is left blank (keep the current one). */
  password: string | null;
}

export type AdminUserParseResult =
  | { success: true; data: AdminUserInput }
  | { success: false; fieldErrors: AdminUserFieldErrors };

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome.")
    .max(100, "Use no máximo 100 caracteres."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe o e-mail.")
    .pipe(z.email("Informe um e-mail válido.")),
  password: z.string(),
  passwordConfirm: z.string(),
});

export function parseAdminUserForm(
  formData: FormData,
  { requirePassword }: { requirePassword: boolean },
): AdminUserParseResult {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  const parsed = schema.safeParse({
    name: read("name"),
    email: read("email"),
    password: read("password"),
    passwordConfirm: read("passwordConfirm"),
  });

  const fieldErrors: AdminUserFieldErrors = {};
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as AdminUserField;
      fieldErrors[field] ??= issue.message;
    }
    return { success: false, fieldErrors };
  }

  const { name, email, password, passwordConfirm } = parsed.data;
  if (password === "" && requirePassword) {
    fieldErrors.password = "Defina uma senha inicial.";
  } else if (password !== "") {
    if (password.length < MIN_PASSWORD) {
      fieldErrors.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`;
    } else if (new TextEncoder().encode(password).length > MAX_PASSWORD) {
      fieldErrors.password = `Use no máximo ${MAX_PASSWORD} caracteres.`;
    } else if (password !== passwordConfirm) {
      fieldErrors.passwordConfirm = "As senhas não conferem.";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: { name, email, password: password === "" ? null : password },
  };
}
