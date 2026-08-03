import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  getBlogPostBySlug,
  publishedBlogPosts,
} from "@/data/demo-blog-posts";
import { getTourBySlug } from "@/data/demo-tours";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedBlogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedTours = post.relatedTourSlugs
    .map((tourSlug) => getTourBySlug(tourSlug))
    .filter((tour) => tour !== undefined);
  const formattedDate = dateFormatter.format(
    new Date(`${post.publishedAt}T00:00:00Z`),
  );

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Sayfa yolu" className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-brand focus-visible:outline-brand" href="/">
                Ana Sayfa
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link className="hover:text-brand focus-visible:outline-brand" href="/blog">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="min-w-0 truncate text-text" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        <header className="mt-8">
          <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
            {post.category}
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-text sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted">
            <time dateTime={post.publishedAt}>{formattedDate}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} dk okuma</span>
          </div>
        </header>

        <div className="mt-9 border-t border-border pt-8 text-base leading-8 text-muted sm:text-lg">
          <p>{post.excerpt}</p>
          <p className="mt-5">
            Bu yazının ayrıntılı içeriği hazırlanıyor. Güncel rota bilgileri ve
            seyahat notları daha sonra burada yayınlanacaktır.
          </p>
        </div>

        <aside className="mt-10 rounded-lg border border-border bg-surface p-5 sm:p-6" aria-labelledby="related-tours-title">
          <h2 id="related-tours-title" className="text-xl font-bold text-text">
            İlgili turlar
          </h2>
          {relatedTours.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {relatedTours.map((tour) => (
                <li key={tour.id}>
                  <Link
                    href={`/turlar/${tour.slug}`}
                    className="font-bold text-brand underline-offset-4 hover:underline focus-visible:outline-brand"
                  >
                    {tour.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              Bu yazıyla ilişkili tur seçenekleri hazırlanıyor.
            </p>
          )}
        </aside>

        <Button asChild variant="secondary" className="mt-8">
          <Link href="/blog">Tüm Yazılara Dön</Link>
        </Button>
      </article>
    </Container>
  );
}
