import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createUserAccount: vi.fn(),
  deleteAccount: vi.fn(),
  demoteToUser: vi.fn(),
  getUserAccount: vi.fn(),
  promoteToAdmin: vi.fn(),
  requireAdmin: vi.fn(),
  signInWithPassword: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/admin", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/supabase/auth-client", () => ({
  createAuthClient: async () => ({
    auth: { signInWithPassword: mocks.signInWithPassword },
  }),
}));
vi.mock("@/lib/auth/admin-users-repository", () => ({
  AdminAccountError: class AdminAccountError extends Error {},
  createUserAccount: mocks.createUserAccount,
  deleteAccount: mocks.deleteAccount,
  demoteToUser: mocks.demoteToUser,
  getUserAccount: mocks.getUserAccount,
  promoteToAdmin: mocks.promoteToAdmin,
}));

import {
  demoteAdmin,
  promoteUser,
  removeUserAccount,
} from "@/app/admin/admin-users-actions";
import { signUp } from "@/app/cadastro/actions";
import { AdminAccountError } from "@/lib/auth/admin-users-repository";

function form(fields: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = {
  name: "Maria",
  email: "maria@exemplo.com",
  password: "senha-forte-123",
  passwordConfirm: "senha-forte-123",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ADMIN_EMAILS", "dono@exemplo.com");
  mocks.signInWithPassword.mockResolvedValue({ error: null });
});

describe("signUp", () => {
  it("creates the account, signs in and goes to /conta", async () => {
    await expect(signUp({ status: "idle" }, form(valid))).rejects.toThrow(
      "REDIRECT:/conta?criada=1",
    );
    expect(mocks.createUserAccount).toHaveBeenCalledWith({
      name: "Maria",
      email: "maria@exemplo.com",
      password: "senha-forte-123",
    });
  });

  it("refuses e-mails in ADMIN_EMAILS, whatever the casing", async () => {
    const result = await signUp(
      { status: "idle" },
      form({ ...valid, email: "  DONO@Exemplo.com " }),
    );
    // Indistinguishable from an e-mail already taken.
    expect(result).toEqual({
      status: "error",
      message: "Já existe um usuário com esse e-mail.",
    });
    expect(mocks.createUserAccount).not.toHaveBeenCalled();
  });

  it("creates nothing when the honeypot is filled", async () => {
    await expect(
      signUp({ status: "idle" }, form({ ...valid, website: "spam" })),
    ).rejects.toThrow("REDIRECT:/entrar");
    expect(mocks.createUserAccount).not.toHaveBeenCalled();
  });

  it("returns field errors without creating an account", async () => {
    const result = await signUp(
      { status: "idle" },
      form({ ...valid, passwordConfirm: "outra-senha-123" }),
    );
    expect(result.fieldErrors?.passwordConfirm).toBeDefined();
    expect(mocks.createUserAccount).not.toHaveBeenCalled();
  });

  it("shows the repository's message when the e-mail is taken", async () => {
    mocks.createUserAccount.mockRejectedValueOnce(
      new AdminAccountError("Já existe um usuário com esse e-mail."),
    );
    const result = await signUp({ status: "idle" }, form(valid));
    expect(result).toEqual({
      status: "error",
      message: "Já existe um usuário com esse e-mail.",
    });
  });

  it("sends the person to /entrar if the automatic login fails", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: new Error("falhou") });
    await expect(signUp({ status: "idle" }, form(valid))).rejects.toThrow(
      "REDIRECT:/entrar",
    );
  });
});

describe("promoteUser", () => {
  it("promotes an ordinary user when called by an admin", async () => {
    mocks.getUserAccount.mockResolvedValue({ id: "u1", isAdmin: false });
    await expect(promoteUser("u1")).rejects.toThrow(
      "REDIRECT:/admin/contas?promovido=1",
    );
    expect(mocks.promoteToAdmin).toHaveBeenCalledWith("u1");
  });

  it("does nothing for callers who aren't admins", async () => {
    mocks.requireAdmin.mockImplementationOnce(() => {
      throw new Error("REDIRECT:/conta");
    });
    await expect(promoteUser("u1")).rejects.toThrow("REDIRECT:/conta");
    expect(mocks.getUserAccount).not.toHaveBeenCalled();
    expect(mocks.promoteToAdmin).not.toHaveBeenCalled();
  });

  it("returns an error when the lookup throws (e.g. an invalid id)", async () => {
    vi.spyOn(console, "error").mockImplementationOnce(() => {});
    mocks.getUserAccount.mockRejectedValueOnce(new Error("invalid uuid"));
    expect((await promoteUser("nao-e-uuid")).error).toBeDefined();
    expect(mocks.promoteToAdmin).not.toHaveBeenCalled();
  });

  it("reports unknown accounts and existing admins", async () => {
    mocks.getUserAccount.mockResolvedValueOnce(null);
    expect((await promoteUser("nope")).error).toBeDefined();
    mocks.getUserAccount.mockResolvedValueOnce({ id: "u1", isAdmin: true });
    expect((await promoteUser("u1")).error).toBeDefined();
    expect(mocks.promoteToAdmin).not.toHaveBeenCalled();
  });
});

describe("demoteAdmin", () => {
  beforeEach(() => {
    mocks.requireAdmin.mockResolvedValue({ id: "me" });
  });

  it("demotes another admin", async () => {
    mocks.getUserAccount.mockResolvedValue({
      id: "a1",
      isAdmin: true,
      fixed: false,
    });
    await expect(demoteAdmin("a1")).rejects.toThrow(
      "REDIRECT:/admin/contas?rebaixado=1",
    );
    expect(mocks.demoteToUser).toHaveBeenCalledWith("a1");
  });

  it("does nothing for callers who aren't admins", async () => {
    mocks.requireAdmin.mockImplementationOnce(() => {
      throw new Error("REDIRECT:/conta");
    });
    await expect(demoteAdmin("a1")).rejects.toThrow("REDIRECT:/conta");
    expect(mocks.demoteToUser).not.toHaveBeenCalled();
  });

  it("refuses the caller's own account", async () => {
    expect((await demoteAdmin("me")).error).toBeDefined();
    expect(mocks.demoteToUser).not.toHaveBeenCalled();
  });

  it("refuses fixed admins, ordinary users and unknown accounts", async () => {
    for (const target of [
      { id: "a1", isAdmin: true, fixed: true },
      { id: "a1", isAdmin: false, fixed: false },
      null,
    ]) {
      mocks.getUserAccount.mockResolvedValueOnce(target);
      expect((await demoteAdmin("a1")).error).toBeDefined();
    }
    expect(mocks.demoteToUser).not.toHaveBeenCalled();
  });

  it("returns an error when the lookup throws", async () => {
    vi.spyOn(console, "error").mockImplementationOnce(() => {});
    mocks.getUserAccount.mockRejectedValueOnce(new Error("invalid uuid"));
    expect((await demoteAdmin("nao-e-uuid")).error).toBeDefined();
  });
});

describe("removeUserAccount", () => {
  it("deletes an ordinary account", async () => {
    mocks.getUserAccount.mockResolvedValue({ id: "u1", isAdmin: false });
    await expect(removeUserAccount("u1")).rejects.toThrow(
      "REDIRECT:/admin/contas?excluida=1",
    );
    expect(mocks.deleteAccount).toHaveBeenCalledWith("u1");
  });

  it("does nothing for callers who aren't admins", async () => {
    mocks.requireAdmin.mockImplementationOnce(() => {
      throw new Error("REDIRECT:/conta");
    });
    await expect(removeUserAccount("u1")).rejects.toThrow("REDIRECT:/conta");
    expect(mocks.deleteAccount).not.toHaveBeenCalled();
  });

  it("refuses admins and unknown accounts", async () => {
    mocks.getUserAccount.mockResolvedValueOnce({ id: "a1", isAdmin: true });
    expect((await removeUserAccount("a1")).error).toBeDefined();
    mocks.getUserAccount.mockResolvedValueOnce(null);
    expect((await removeUserAccount("nope")).error).toBeDefined();
    expect(mocks.deleteAccount).not.toHaveBeenCalled();
  });
});
