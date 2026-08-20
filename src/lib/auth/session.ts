import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_HOURS } from "@/lib/auth/constants";
import { createSessionToken, hashSessionToken } from "@/lib/auth/password";
import { getD1, isoNow } from "@/lib/cloudflare/context";

export type AdminIdentity = { id: string; email: string; displayName: string | null };

export async function createAdminSession(adminUserId: string) {
  const db = await getD1();
  const token = createSessionToken();
  const expires = new Date(Date.now() + ADMIN_SESSION_HOURS * 60 * 60 * 1000);
  await db.prepare("INSERT INTO admin_sessions (id, admin_user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), adminUserId, await hashSessionToken(token), expires.toISOString(), isoNow()).run();
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires });
}

export async function getAdmin(): Promise<AdminIdentity | null> {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await (await getD1()).prepare("SELECT u.id, u.email, u.display_name FROM admin_sessions s JOIN admin_users u ON u.id = s.admin_user_id WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = 1 LIMIT 1")
    .bind(await hashSessionToken(token), isoNow()).first<{ id: string; email: string; display_name: string | null }>();
  return row ? { id: row.id, email: row.email, displayName: row.display_name } : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/giris");
  return admin;
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await (await getD1()).prepare("DELETE FROM admin_sessions WHERE token_hash = ?").bind(await hashSessionToken(token)).run();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
