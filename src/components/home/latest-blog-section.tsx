import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { getPublishedBlogPosts } from "@/lib/db/repositories/public-content";

export async function LatestBlogSection() {
  const publishedBlogPosts = await getPublishedBlogPosts();
  if (publishedBlogPosts.length === 0) return null;
  return (
    <Section
      aria-labelledby="latest-blog-title"
      className="bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
          Gezi Rehberi
        </p>
        <h2
          id="latest-blog-title"
          className="mt-3 text-3xl leading-tight font-bold tracking-tight text-text sm:text-4xl"
        >
          Yeni rotalar için ilham alın
        </h2>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Seyahat öncesinde bilmeniz gerekenleri, destinasyon önerilerini ve
          gezi ipuçlarını keşfedin.
        </p>
      </div>

      <div className="mt-8 grid items-stretch gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {publishedBlogPosts.slice(0, 3).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:mt-10">
        <Button asChild variant="secondary">
          <Link href="/blog">Tüm Yazıları Gör</Link>
        </Button>
      </div>
    </Section>
  );
}
