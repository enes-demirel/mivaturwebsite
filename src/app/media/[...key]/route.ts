import { getMediaBucket } from "@/lib/cloudflare/context";

export async function GET(request:Request,{params}:{params:Promise<{key:string[]}>}) {
  const key=(await params).key.join("/");
  if (!key || key.includes("..")) return new Response("Not found",{status:404});
  const object=await (await getMediaBucket()).get(key);
  if (!object) return new Response("Not found",{status:404});
  const headers=new Headers(); object.writeHttpMetadata(headers); headers.set("etag",object.httpEtag); headers.set("x-content-type-options","nosniff");
  if (!headers.has("cache-control")) headers.set("cache-control","public, max-age=31536000, immutable");
  if (new URL(request.url).searchParams.get("download")==="1" && headers.get("content-type")==="application/pdf") {
    const filename=(key.split("/").at(-1)??"tur-programi.pdf").replace(/[^a-zA-Z0-9._-]/g,"-");
    headers.set("content-disposition",`attachment; filename="${filename}"`);
  }
  return new Response(object.body,{headers});
}
