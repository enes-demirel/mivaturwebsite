import Link from "next/link";

import type { Review } from "@/types/review";

const reviewDateFormatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function StarRating({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, rating));

  return (
    <span
      className="inline-flex items-center gap-0.5 text-brand"
      role="img"
      aria-label={`5 üzerinden ${normalizedRating} yıldız`}
    >
      <span aria-hidden="true" className="tracking-[0.08em]">
        {"★".repeat(Math.round(normalizedRating))}
        <span className="text-border">
          {"★".repeat(5 - Math.round(normalizedRating))}
        </span>
      </span>
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const initials = review.authorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("")
    .toLocaleUpperCase("tr-TR");
  const formattedDate = reviewDateFormatter.format(
    new Date(`${review.publishedAt}T00:00:00Z`),
  );

  return (
    <article className="flex h-full snap-start flex-col rounded-lg border border-border bg-surface p-5 shadow-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/15 hover:shadow-[0_12px_30px_rgb(37_35_41_/_0.07)] sm:p-6">
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/8 text-sm font-extrabold text-brand ring-1 ring-brand/10"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <h3 className="font-bold text-text">{review.authorName}</h3>
          <time
            dateTime={review.publishedAt}
            className="mt-0.5 block text-xs text-muted"
          >
            {formattedDate}
          </time>
        </div>
      </header>

      <div className="mt-4">
        <StarRating rating={review.rating} />
      </div>
      <p className="mt-4 line-clamp-5 text-sm leading-6 text-muted">
        {review.content}
      </p>

      {review.externalUrl && (
        <Link
          href={review.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 self-start text-sm font-bold text-brand transition-colors hover:text-brand-hover"
        >
          Google&apos;da Görüntüle
        </Link>
      )}
    </article>
  );
}
