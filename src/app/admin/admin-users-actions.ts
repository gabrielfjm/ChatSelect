"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import {
  parseAdminUserForm,
  type AdminUserFieldErrors,
} from "@/lib/auth/admin-user-form";
import {
  AdminAccountError,
  createAdminAccount,
  deleteAdminAccount,
  getAdminAccount,
  listAdminAccounts,
  updateAdminAccount,
} from "@/lib/auth/admin-users-repository";

/**
 * CRUD for administrator accounts. Like every admin action, each one calls
 * requireAdmin() itself. Guard rails against locking everyone out:
 * nobody deletes their own account, fixed (ADMIN_EMAILS) admins can't be
 * deleted or have their e-mail changed, and the last admin always stays.
 */

export interface AdminUserFormState {
  status: "idle" | "saved" | "error";
  fieldErrors?: AdminUserFieldErrors;
  message?: string;
}

function refreshAdminPages() {
  // The header shows the signed-in admin's name/e-mail on every page.
  revalidatePath("/", "layout");
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof AdminAccountError) return error.message;
  console.error(error);
  return fallback;
}

export async function saveAdminUser(
  id: string | null,
  _previous: AdminUserFormState,
  formData: FormData,
): Promise<AdminUserFormState> {
  await requireAdmin();

  const parsed = parseAdminUserForm(formData, { requirePassword: !id });
  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.fieldErrors,
      message: "Revise os campos destacados.",
    };
  }

  let createdId: string | null = null;
  try {
    if (id) {
      const current = await getAdminAccount(id);
      if (!current) {
        return { status: "error", message: "Administrador não encontrado." };
      }
      if (current.fixed && parsed.data.email !== current.email) {
        return {
          status: "error",
          fieldErrors: {
            email:
              "Este administrador é fixo (ADMIN_EMAILS); o e-mail só muda na configuração do servidor.",
          },
          message: "Revise os campos destacados.",
        };
      }
      await updateAdminAccount(id, parsed.data);
    } else {
      const created = await createAdminAccount({
        ...parsed.data,
        password: parsed.data.password!,
      });
      createdId = created.id;
    }
  } catch (error) {
    return {
      status: "error",
      message: errorMessage(error, "Não foi possível salvar. Tente de novo."),
    };
  }

  refreshAdminPages();
  if (createdId) redirect(`/admin/administradores/${createdId}?criado=1`);
  return { status: "saved", message: "Alterações salvas." };
}

export interface DeleteAdminState {
  error?: string;
}

export async function removeAdminUser(id: string): Promise<DeleteAdminState> {
  const me = await requireAdmin();

  if (id === me.id) {
    return { error: "Você não pode excluir a própria conta." };
  }
  const target = await getAdminAccount(id);
  if (!target) return { error: "Administrador não encontrado." };
  if (target.fixed) {
    return {
      error:
        "Este administrador é fixo (ADMIN_EMAILS) e só pode ser removido na configuração do servidor.",
    };
  }
  if ((await listAdminAccounts()).length <= 1) {
    return { error: "É preciso manter pelo menos um administrador." };
  }

  try {
    await deleteAdminAccount(id);
  } catch (error) {
    return { error: errorMessage(error, "Não foi possível excluir.") };
  }

  refreshAdminPages();
  redirect("/admin/administradores?excluido=1");
}
