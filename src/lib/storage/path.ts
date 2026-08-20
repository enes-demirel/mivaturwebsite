import { z } from "zod";

import { IMAGE_MIME_EXTENSIONS, type ImageMimeType } from "@/lib/storage/file-validation";

const uuid = z.uuid();

export function createImageStoragePath(tourId: string, mimeType: ImageMimeType) {
  return `${tourId}/${crypto.randomUUID()}.${IMAGE_MIME_EXTENSIONS[mimeType]}`;
}

export function createPdfStoragePath(tourId: string) {
  return `${tourId}/${crypto.randomUUID()}.pdf`;
}

export function isValidTourStoragePath(path: string, tourId: string, extensions: readonly string[]) {
  const prefix = extensions.includes("pdf") ? "tour-pdfs" : "tour-images";
  if (!uuid.safeParse(tourId).success || !path.startsWith(`${prefix}/${tourId}/`)) return false;
  const fileName = path.slice(prefix.length + tourId.length + 2);
  const match = /^([0-9a-f-]{36})\.([a-z0-9]+)$/.exec(fileName);
  return Boolean(match && uuid.safeParse(match[1]).success && extensions.includes(match[2]));
}

export function isValidBlogStoragePath(path: string, blogId: string) {
  if (!uuid.safeParse(blogId).success || !path.startsWith(`blog-images/${blogId}/`)) return false;
  const fileName = path.slice(`blog-images/${blogId}/`.length);
  const match = /^([0-9a-f-]{36})\.(jpg|png|webp|avif)$/.exec(fileName);
  return Boolean(match && uuid.safeParse(match[1]).success);
}
