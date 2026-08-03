export const IMAGE_BUCKET = "tour-images";
export const PDF_BUCKET = "tour-pdfs";
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_PDF_SIZE = 10 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_COUNT = 10;

export const IMAGE_MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type ImageMimeType = keyof typeof IMAGE_MIME_EXTENSIONS;

export function isImageMimeType(value: string): value is ImageMimeType {
  return value in IMAGE_MIME_EXTENSIONS;
}

export function validateImageFile(file: File): string | null {
  if (file.size === 0) return "Boş dosyalar yüklenemez.";
  if (file.size > MAX_IMAGE_SIZE) return "Görsel en fazla 5 MB olabilir.";
  if (!isImageMimeType(file.type)) return "Yalnızca JPEG, PNG, WebP veya AVIF yükleyin.";

  const extension = file.name.split(".").pop()?.toLocaleLowerCase("en-US");
  const allowedExtensions = file.type === "image/jpeg" ? ["jpg", "jpeg"] : [IMAGE_MIME_EXTENSIONS[file.type]];
  return extension && allowedExtensions.includes(extension) ? null : "Dosya uzantısı görsel türüyle eşleşmiyor.";
}

export function validatePdfFile(file: File): string | null {
  if (file.size === 0) return "Boş dosyalar yüklenemez.";
  if (file.size > MAX_PDF_SIZE) return "PDF en fazla 10 MB olabilir.";
  if (file.type !== "application/pdf") return "Yalnızca PDF dosyası yükleyin.";
  return file.name.toLocaleLowerCase("en-US").endsWith(".pdf") ? null : "Dosya uzantısı .pdf olmalıdır.";
}

export function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} MB`;
}
