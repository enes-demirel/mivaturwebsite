import { getMediaBucket } from "@/lib/cloudflare/context";

export async function GET(_request:Request,{params}:{params:Promise<{key:string[]}>}) {
  const key=(await params).key.join("/");
  if (!key || key.includes("..")) return new Response("Not found",{status:404});
  const object=await (await getMediaBucket()).get(key);
  if (!object) return new Response("Not found",{status:404});
  const headers=new Headers(); object.writeHttpMetadata(headers); headers.set("etag",object.httpEtag); headers.set("x-content-type-options","nosniff");
  if (!headers.has("cache-control")) headers.set("cache-control","public, max-age=31536000, immutable");
  return new Response(object.body,{headers});
}
