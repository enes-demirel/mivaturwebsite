import Link from "next/link";

import { ReviewCard, StarRating } from "@/components/home/review-card";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { demoReviews, demoReviewSummary } from "@/data/demo-reviews";
import { siteConfig } from "@/data/site-config";

export function GoogleReviewsSection() {
  const reviews = [...demoReviews].sort((reviewA, reviewB) => {
    if (reviewA.featured !== reviewB.featured) {
      return reviewA.featured ? -1 : 1;
    }

    return reviewA.order - reviewB.order;
  });

  return (
    <Section
      aria-labelledby="google-reviews-title"
      className="border-y border-border/70 bg-surface py-14 sm:py-16 lg:py-20"
      data-review-content={demoReviewSummary.isDemo ? "demo" : "live"}
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold tracking-[0.12em] text-brand uppercase">
            Misafir Deneyimleri
          </p>
          <h2
            id="google-reviews-title"
            className="text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-4xl"
          >
            Misafirlerimiz Mivatur’u anlatıyor
          </h2>
          <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
            Turlarımıza katılan misafirlerimizin deneyimlerini keşfedin.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-border bg-background/70 px-5 py-4 sm:w-fit">
          <p className="text-4xl font-extrabold tracking-tight text-text tabular-nums">
            {demoReviewSummary.averageRating.toFixed(1)}
          </p>
          <div>
            <StarRating rating={demoReviewSummary.averageRating} />
            <p className="mt-1 text-sm font-semibold text-text">
              Google değerlendirmeleri
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {demoReviewSummary.totalReviewCount} yorum
            </p>
          </div>
        </div>
      </div>

      <ReviewsCarousel itemCount={reviews.length}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ReviewsCarousel>

      {siteConfig.googleReviewsUrl && (
        <Button asChild variant="secondary" className="mt-7 w-full sm:w-auto">
          <Link href={siteConfig.googleReviewsUrl} target="_blank" rel="noreferrer">
            Tüm Google Yorumlarını Gör
          </Link>
        </Button>
      )}
    </Section>
  );
}
