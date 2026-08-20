import type { MetadataRoute } from "next";
import { getPublishedSitemapEntries } from "@/lib/db/repositories/public-content";

export const dynamic = "force-dynamic";
const base = "https://mivatur.com";

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const data = await getPublishedSitemapEntries();
  const staticPaths = ["", "/turlar", "/yurtdisi-turlari", "/yurtici-turlari", "/ozel-tur-talebi", "/blog", "/hakkimizda", "/iletisim", "/sikca-sorulan-sorular", "/kvkk-aydinlatma-metni", "/cerez-politikasi"];
  return [
    ...staticPaths.map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:path===""?1:0.8})),
    ...data.tours.map((item)=>({url:`${base}/turlar/${item.slug}`,lastModified:new Date(item.updated_at),changeFrequency:"weekly" as const,priority:0.8})),
    ...data.blogs.map((item)=>({url:`${base}/blog/${item.slug}`,lastModified:new Date(item.updated_at),changeFrequency:"monthly" as const,priority:0.6})),
    ...data.destinations.map((item)=>({url:`${base}/destinasyonlar/${item.slug}`,lastModified:new Date(item.updated_at),changeFrequency:"monthly" as const,priority:0.6})),
  ];
}
