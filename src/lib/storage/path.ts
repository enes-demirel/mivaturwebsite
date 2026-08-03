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
  if (!uuid.safeParse(tourId).success || !path.startsWith(`${tourId}/`)) return false;
  const fileName = path.slice(tourId.length + 1);
  const match = /^([0-9a-f-]{36})\.([a-z0-9]+)$/.exec(fileName);
  return Boolean(match && uuid.safeParse(match[1]).success && extensions.includes(match[2]));
}
