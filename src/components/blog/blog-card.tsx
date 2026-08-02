import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "@/types/blog-post";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

type BlogCardProps = {
  post: BlogPost;
  headingLevel?: "h2" | "h3";
};

export function BlogCard({ post, headingLevel = "h3" }: BlogCardProps) {
  const Heading = headingLevel;
  const formattedDate = dateFormatter.format(
    new Date(`${post.publishedAt}T00:00:00Z`),
  );

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        aria-label={`${post.title} yazısını oku`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface outline-none transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_12px_32px_rgb(37_35_41_/_0.07)] focus-visible:ring-3 focus-visible:ring-brand/25 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <div className="relative aspect-[8/5] overflow-hidden bg-border/30">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-extrabold tracking-[0.12em] text-brand uppercase">
            {post.category}
          </p>
          <Heading className="mt-3 line-clamp-3 text-xl leading-7 font-bold tracking-tight text-text transition-colors group-hover:text-brand">
            {post.title}
          </Heading>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
            {post.excerpt}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-5 text-xs text-muted">
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} dk okuma</span>
          </div>
          <span className="mt-4 text-sm font-bold text-brand">
            Yazıyı Oku <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
