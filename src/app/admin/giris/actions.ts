"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

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

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { message: "Supabase bağlantısı henüz yapılandırılmamış." };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword(
    parsed.data,
  );

  if (signInError) {
    return { message: "E-posta veya şifre hatalı." };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError || isAdmin !== true) {
    await supabase.auth.signOut();
    return { message: "Bu hesabın yönetim paneli yetkisi bulunmuyor." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}
