import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCloudflareEnv(): Promise<CloudflareEnv> {
  return (await getCloudflareContext({ async: true })).env;
}

export async function getD1(): Promise<D1Database> {
  return (await getCloudflareEnv()).MIVATUR_DB;
}

export async function getMediaBucket(): Promise<R2Bucket> {
  return (await getCloudflareEnv()).MIVATUR_MEDIA;
}

export function isoNow() {
  return new Date().toISOString();
}
