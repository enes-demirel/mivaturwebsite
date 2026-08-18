import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const requiredText = (min: number, max: number, label: string) => z.string().trim().min(min, `${label} en az ${min} karakter olmalıdır.`).max(max, `${label} en fazla ${max} karakter olabilir.`);

export const itinerarySchema = z.object({
  title: requiredText(2, 160, "Başlık"),
  route: optionalText(250),
  summary: optionalText(600),
  description: optionalText(12000),
  image_path: optionalText(500),
  image_alt: optionalText(180),
  highlights: z.array(z.string().trim()).transform((items) => items.filter(Boolean)).pipe(z.array(requiredText(2, 180, "Öne çıkan madde")).max(20, "En fazla 20 öne çıkan madde eklenebilir.")),
  transportation: optionalText(500),
  accommodation: optionalText(500),
  meals: optionalText(500),
}).superRefine((value, context) => {
  if (value.image_path && !value.image_alt) context.addIssue({ code: "custom", path: ["image_alt"], message: "Görsel seçildiğinde alt metin zorunludur." });
});

export const hotelSchema = z.object({
  city: requiredText(2, 100, "Şehir"),
  hotel_name: requiredText(2, 180, "Otel adı"),
  night_count: z.coerce.number().int().min(1, "Gece sayısı en az 1 olmalıdır.").max(60, "Gece sayısı en fazla 60 olabilir."),
  stars: z.union([z.literal(""), z.coerce.number().int().min(1).max(5)]).transform((value) => value === "" ? null : value),
});

export const serviceTypeSchema = z.enum(["included", "excluded"]);
export const serviceSchema = z.object({ content: requiredText(2, 600, "Hizmet maddesi") });

export const importantNoteSchema = z.object({
  title: z.string().trim().max(160, "Başlık en fazla 160 karakter olabilir.").refine((value) => value.length === 0 || value.length >= 2, "Başlık en az 2 karakter olmalıdır.").transform((value) => value || null),
  content: requiredText(2, 4000, "Açıklama"),
});

export const faqSchema = z.object({
  question: requiredText(5, 250, "Soru"),
  answer: requiredText(5, 5000, "Cevap"),
  published: z.boolean(),
});

export type ItineraryInput = z.input<typeof itinerarySchema>;
export type HotelInput = z.input<typeof hotelSchema>;
export type ServiceInput = z.input<typeof serviceSchema>;
export type ImportantNoteInput = z.input<typeof importantNoteSchema>;
export type FaqInput = z.input<typeof faqSchema>;
