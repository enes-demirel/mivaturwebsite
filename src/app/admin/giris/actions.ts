"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession } from "@/lib/auth/session";
import { first } from "@/lib/db/query";

export type LoginActionState = {
  message: string | null;
};

const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta adresi girin."),
  password: z.string().min(1, "Şifrenizi girin."),
});

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Alanları kontrol edin." };
  }

  const user = await first<{ id: string; password_hash: string; active: number }>("SELECT id, password_hash, active FROM admin_users WHERE email = ? COLLATE NOCASE LIMIT 1", [parsed.data.email]);
  if (!user || user.active !== 1 || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return { message: "E-posta veya şifre hatalı." };
  }
  await createAdminSession(user.id);

  revalidatePath("/admin", "layout");
  redirect("/admin");
}
