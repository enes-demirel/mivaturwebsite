import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/data/site-config";

export function GoogleReviewsSection() {
  return (
    <Section
      aria-labelledby="google-reviews-title"
      className="border-y border-border/70 bg-surface py-14 sm:py-16 lg:py-20"
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

        <p className="max-w-sm text-sm leading-6 text-muted lg:text-right">Doğrulanmış Google değerlendirmeleri bağlantısı eklendiğinde burada yayınlanacaktır.</p>
      </div>

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
