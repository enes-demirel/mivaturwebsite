import "server-only";

import { getD1 } from "@/lib/cloudflare/context";

export async function first<T>(sql: string, values: readonly unknown[] = []) {
  return (await getD1()).prepare(sql).bind(...values).first<T>();
}

export async function all<T>(sql: string, values: readonly unknown[] = []) {
  return (await (await getD1()).prepare(sql).bind(...values).all<T>()).results;
}

export async function run(sql: string, values: readonly unknown[] = []) {
  return (await getD1()).prepare(sql).bind(...values).run();
}

export async function batch(statements: readonly { sql: string; values?: readonly unknown[] }[]) {
  const db = await getD1();
  return db.batch(statements.map(({ sql, values = [] }) => db.prepare(sql).bind(...values)));
}

export function dbBoolean(value: unknown) {
  return value === 1 || value === true;
}

export function jsonArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  try { const parsed: unknown = JSON.parse(value); return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : []; } catch { return []; }
}
