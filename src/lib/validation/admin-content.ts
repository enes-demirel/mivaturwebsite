import { z } from "zod";

const optional = (max: number) => z.string().trim().max(max).transform((value) => value || null);
const required = (label: string, max: number) => z.string().trim().min(2, `${label} zorunludur.`).max(max);
const status = z.enum(["draft", "published", "archived"]);

export const blogPostSchema = z.object({
  title: required("Başlık", 180), slug: required("Slug", 180), excerpt: required("Kısa açıklama", 600),
  content: required("İçerik", 30000), status, published_at: optional(30), seo_title: optional(180), seo_description: optional(320),
});

export const destinationSchema = z.object({
  name: required("Destinasyon adı", 140), slug: required("Slug", 180), country_code: optional(2),
  type: z.enum(["international", "domestic"]), short_description: optional(600), content: optional(20000),
  map_longitude: z.union([z.literal(""), z.coerce.number().min(-180).max(180)]).transform((value) => value === "" ? null : value),
  map_latitude: z.union([z.literal(""), z.coerce.number().min(-90).max(90)]).transform((value) => value === "" ? null : value),
  map_order: z.coerce.number().int().min(0).max(10000), map_featured: z.boolean(), mobile_visible: z.boolean(),
  status, seo_title: optional(180), seo_description: optional(320),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
