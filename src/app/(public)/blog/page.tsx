import type { Metadata } from "next";

import { BlogCard } from "@/components/blog/blog-card";
import { Container } from "@/components/ui/container";
import { publishedBlogPosts } from "@/data/demo-blog-posts";

export const metadata: Metadata = {
  title: "Gezi Rehberi",
  description:
    "Mivatur gezi rehberindeki destinasyon önerilerini ve seyahat ipuçlarını keşfedin.",
};

export default function BlogPage() {
  return (
    <Container className="py-14 sm:py-16 lg:py-20">
      <header className="max-w-3xl">
        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
          Mivatur Blog
        </p>
        <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-text sm:text-5xl">
          Gezi rehberi
        </h1>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          Yeni rotalar için destinasyon önerilerini ve seyahat öncesi pratik
          bilgileri inceleyin.
        </p>
      </header>

      <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {publishedBlogPosts.map((post) => (
          <BlogCard key={post.id} post={post} headingLevel="h2" />
        ))}
      </div>
    </Container>
  );
}
