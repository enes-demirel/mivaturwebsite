import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) return null;
  return data.claims;
}

export async function isCurrentUserAdmin() {
  const claims = await getCurrentClaims();
  if (!claims) return false;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

export async function requireAdmin() {
  const claims = await getCurrentClaims();
  if (!claims) redirect("/admin/giris");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) redirect("/admin/giris?error=yetkisiz");

  return claims;
}
