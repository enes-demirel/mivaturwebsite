import { z } from "zod";

export const accommodationTypeSchema = z.enum(["three-star", "four-star", "five-star", "boutique", "apart", "any"]);

export const customTourRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalıdır.").max(120, "Ad soyad en fazla 120 karakter olabilir."),
  email: z.email("Geçerli bir e-posta adresi girin.").max(254),
  phone: z.string().trim().min(7, "Telefon en az 7 karakter olmalıdır.").max(30, "Telefon en fazla 30 karakter olabilir."),
  startDate: z.iso.date("Geçerli bir başlangıç tarihi seçin."),
  endDate: z.iso.date("Geçerli bir bitiş tarihi seçin."),
  participantCount: z.coerce.number().int("Katılımcı sayısı tam sayı olmalıdır.").min(1, "En az 1 katılımcı olmalıdır.").max(200, "En fazla 200 katılımcı olabilir."),
  accommodationType: accommodationTypeSchema,
  destinations: z.string().trim().min(2, "Gezmek istediğiniz yerleri yazın.").max(2000, "Bu alan en fazla 2000 karakter olabilir."),
  notes: z.string().trim().max(4000, "Notlar en fazla 4000 karakter olabilir.").optional(),
}).refine((value) => value.endDate >= value.startDate, { path: ["endDate"], message: "Bitiş tarihi başlangıç tarihinden önce olamaz." });

export type CustomTourRequestInput = z.input<typeof customTourRequestSchema>;
