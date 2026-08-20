import "server-only";
import { getMediaBucket } from "@/lib/cloudflare/context";

export function mediaUrl(key: string) { return `/media/${key.split("/").map(encodeURIComponent).join("/")}`; }
export async function removeMedia(key: string) { await (await getMediaBucket()).delete(key); }
export async function mediaExists(key: string) { return Boolean(await (await getMediaBucket()).head(key)); }
