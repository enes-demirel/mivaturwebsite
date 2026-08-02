import Link from "next/link";

import { MobileDestinationStrip } from "@/components/home/mobile-destination-strip";
import { WorldMap } from "@/components/home/world-map";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { worldMapHeroContent } from "@/data/home-content";
import { mapDestinations } from "@/data/map-destinations";

export function WorldMapHero() {
  const destinations = [...mapDestinations].sort((a, b) => a.order - b.order);

  return (
    <section
      aria-labelledby="world-map-hero-title"
      className="relative overflow-x-clip bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[30rem] max-w-full bg-[radial-gradient(circle_at_58%_40%,var(--color-surface)_0%,transparent_62%)] opacity-75 sm:block"
      />
      <Container className="relative grid min-w-0 max-w-[1380px]! grid-cols-1 gap-5 py-7 sm:gap-7 sm:py-9 lg:min-h-[680px] lg:grid-cols-[minmax(0,0.54fr)_minmax(0,1fr)] lg:items-center lg:gap-4 lg:py-10 xl:min-h-[720px] xl:gap-7">
        <div className="relative z-20 min-w-0 max-w-full lg:max-w-[29rem] lg:pr-3 xl:max-w-[31rem]">
          <p className="mb-3 text-xs font-extrabold tracking-[0.18em] text-brand uppercase sm:text-sm">
            {worldMapHeroContent.eyebrow}
          </p>
          <h1
            id="world-map-hero-title"
            className="min-w-0 max-w-full text-[2.5rem] leading-[1.08] font-bold tracking-[-0.035em] text-text sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[4rem]"
          >
            {worldMapHeroContent.title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {worldMapHeroContent.description}
          </p>
          <div className="mt-7 hidden lg:block">
            <Button asChild>
              <Link href={worldMapHeroContent.cta.href}>
                {worldMapHeroContent.cta.label}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-w-0 max-w-full lg:w-full">
          <WorldMap destinations={destinations} />
        </div>

        <div className="min-w-0 max-w-full lg:hidden">
          <MobileDestinationStrip destinations={destinations} />
          <Button asChild className="mt-5 w-full">
            <Link href={worldMapHeroContent.cta.href}>
              {worldMapHeroContent.cta.label}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
