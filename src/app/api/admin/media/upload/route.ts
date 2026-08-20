import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getMediaBucket } from "@/lib/cloudflare/context";
import { first } from "@/lib/db/query";
import { IMAGE_MIME_EXTENSIONS, isImageMimeType, MAX_IMAGE_SIZE, MAX_PDF_SIZE } from "@/lib/storage/file-validation";

const uuid=z.uuid();
export async function POST(request:Request) {
  await requireAdmin();
  const form=await request.formData(), file=form.get("file"), ownerId=form.get("ownerId"), kind=form.get("kind");
  if (!(file instanceof File) || typeof ownerId!=="string" || !uuid.safeParse(ownerId).success || (kind!=="image"&&kind!=="pdf"&&kind!=="blog-image")) return NextResponse.json({message:"Geçersiz yükleme isteği."},{status:400});
  const ownerTable=kind==="blog-image"?"blog_posts":"tours";
  if (!await first(`SELECT id FROM ${ownerTable} WHERE id=?`,[ownerId])) return NextResponse.json({message:"İçerik bulunamadı."},{status:404});
  const image=(kind==="image"||kind==="blog-image")&&isImageMimeType(file.type)&&file.size>0&&file.size<=MAX_IMAGE_SIZE;
  const pdf=kind==="pdf"&&file.type==="application/pdf"&&file.size>0&&file.size<=MAX_PDF_SIZE;
  if (!image&&!pdf) return NextResponse.json({message:"Dosya türü veya boyutu geçersiz."},{status:400});
  const extension=image?IMAGE_MIME_EXTENSIONS[file.type as keyof typeof IMAGE_MIME_EXTENSIONS]:"pdf";
  const prefix=kind==="image"?"tour-images":kind==="pdf"?"tour-pdfs":"blog-images";
  const key=`${prefix}/${ownerId}/${crypto.randomUUID()}.${extension}`;
  await (await getMediaBucket()).put(key,file.stream(),{httpMetadata:{contentType:file.type,cacheControl:"public, max-age=31536000, immutable"},customMetadata:{ownerId,kind}});
  return NextResponse.json({path:key});
}
