import type { BlogPost } from "@/types/blog-post";

// Demo content: replace these records with approved editorial content later.
export const demoBlogPosts = [
  {
    id: "blog-balkan-rehberi",
    title: "Balkan Turu Öncesi Bilmeniz Gerekenler",
    slug: "balkan-turu-oncesi-bilmeniz-gerekenler",
    excerpt:
      "Balkan rotanıza çıkmadan önce program temposu, valiz hazırlığı ve bölgeye dair temel notlara göz atın.",
    image: "/images/blog/demo/balkan-rehberi.svg",
    imageAlt: "Balkan dağları ve kıvrımlı seyahat rotası illüstrasyonu",
    category: "Gezi Rehberi",
    publishedAt: "2026-06-12",
    readingTime: 6,
    featured: true,
    order: 1,
    relatedTourSlugs: ["buyuk-balkan-turu"],
    status: "published",
  },
  {
    id: "blog-japonya-donem",
    title: "Japonya’ya Gitmek İçin En Güzel Dönem",
    slug: "japonyaya-gitmek-icin-en-guzel-donem",
    excerpt:
      "Japonya'nın mevsimlerini, farklı dönemlerin öne çıkan yönlerini ve rota planlarken dikkat edilecek noktaları keşfedin.",
    image: "/images/blog/demo/japonya-donem.svg",
    imageAlt: "Japonya manzarası ve kiraz çiçekleri illüstrasyonu",
    category: "Destinasyon Önerileri",
    publishedAt: "2026-05-28",
    readingTime: 5,
    featured: true,
    order: 2,
    relatedTourSlugs: [],
    status: "published",
  },
  {
    id: "blog-misir-yerler",
    title: "Mısır Gezisinde Görülmesi Gereken Yerler",
    slug: "misir-gezisinde-gorulmesi-gereken-yerler",
    excerpt:
      "Tarihi yapılar, şehir durakları ve Mısır yolculuğunuza yön verecek önemli gezi noktaları için kısa bir başlangıç rehberi.",
    image: "/images/blog/demo/misir-yerler.svg",
    imageAlt: "Mısır piramitleri ve çöl rotası illüstrasyonu",
    category: "Rota Notları",
    publishedAt: "2026-05-09",
    readingTime: 7,
    featured: true,
    order: 3,
    relatedTourSlugs: ["misir-turu"],
    status: "published",
  },
] as const satisfies readonly BlogPost[];

export const publishedBlogPosts = demoBlogPosts
  .filter((post) => post.status === "published")
  .sort((postA, postB) => postA.order - postB.order);

export function getBlogPostBySlug(slug: string) {
  return publishedBlogPosts.find((post) => post.slug === slug);
}
