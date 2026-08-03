import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || null);
const nullableNumber = z.union([z.literal(""), z.coerce.number().finite().min(0)]).transform((value) => value === "" ? null : value);

export const departureSchema = z.object({
  id: z.union([z.literal(""), z.uuid()]),
  start_date: z.iso.date(),
  end_date: z.iso.date(),
  departure_city: z.string().trim().min(1, "Çıkış şehri zorunludur.").max(100),
  arrival_point: optionalText,
  price: z.coerce.number().finite().positive("Fiyat sıfırdan büyük olmalıdır."),
  currency: z.enum(["TRY", "EUR", "USD"]),
  previous_price: nullableNumber,
  airline: optionalText,
  transportation_note: optionalText,
  status: z.enum(["available", "planned", "sold-out"]),
}).refine((value) => value.end_date >= value.start_date, {
  message: "Bitiş tarihi başlangıç tarihinden önce olamaz.",
  path: ["end_date"],
});

export const tourSchema = z.object({
  title: z.string().trim().min(2, "Tur adı zorunludur.").max(160),
  slug: z.string().trim().min(2, "Slug zorunludur.").max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  type: z.enum(["international", "domestic"]),
  region: optionalText,
  short_description: z.string().trim().min(10, "Kısa açıklama en az 10 karakter olmalıdır.").max(500),
  long_description: optionalText,
  duration_days: z.coerce.number().int().positive("Gün sayısı sıfırdan büyük olmalıdır."),
  duration_nights: z.coerce.number().int().min(0, "Gece sayısı negatif olamaz."),
  transportation_type: z.union([z.literal(""), z.enum(["plane", "bus", "train", "mixed"])]).transform((value) => value || null),
  visa_status: z.union([z.literal(""), z.enum(["visa-free", "visa-required", "special"])]).transform((value) => value || null),
  room_occupancy_label: optionalText,
  single_room_supplement: nullableNumber,
  single_room_supplement_currency: z.union([z.literal(""), z.enum(["TRY", "EUR", "USD"])]).transform((value) => value || null),
  featured_home: z.boolean(),
  featured_order: z.coerce.number().int().min(0, "Sıra negatif olamaz."),
  seo_title: z.string().trim().max(70, "SEO başlığı en fazla 70 karakter olabilir.").transform((value) => value || null),
  seo_description: z.string().trim().max(170, "SEO açıklaması en fazla 170 karakter olabilir.").transform((value) => value || null),
  status: z.enum(["draft", "published"]),
  departures: z.array(departureSchema),
}).superRefine((value, context) => {
  if (value.duration_nights > value.duration_days) {
    context.addIssue({ code: "custom", path: ["duration_nights"], message: "Gece sayısı gün sayısını aşamaz." });
  }
  const keys = new Set<string>();
  value.departures.forEach((departure, index) => {
    const key = `${departure.start_date}|${departure.end_date}|${departure.departure_city.toLocaleLowerCase("tr-TR")}`;
    if (keys.has(key)) context.addIssue({ code: "custom", path: ["departures", index, "start_date"], message: "Aynı kalkış birden fazla kez eklenemez." });
    keys.add(key);
  });
});

export type ValidatedTour = z.infer<typeof tourSchema>;
