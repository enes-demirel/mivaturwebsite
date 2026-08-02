import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { homeAboutContent } from "@/data/home-content";

export function AboutSection() {
  return (
    <Section
      aria-labelledby="home-about-title"
      className="border-y border-border/70 bg-surface py-14 sm:py-16 lg:py-20"
    >
      <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-[0.18em] text-brand uppercase sm:text-sm">
            {homeAboutContent.eyebrow}
          </p>
          <h2
            id="home-about-title"
            className="mt-3 max-w-xl text-3xl leading-tight font-extrabold tracking-[-0.025em] text-text sm:text-4xl lg:text-[2.75rem]"
          >
            {homeAboutContent.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {homeAboutContent.description}
          </p>
          <div className="mt-7 hidden lg:block">
            <Button asChild>
              <Link href={homeAboutContent.cta.href}>
                {homeAboutContent.cta.label}
              </Link>
            </Button>
          </div>
        </div>

        <Image
          src="/images/home/about-placeholder.svg"
          alt="Dağlar arasında uzanan sakin bir seyahat rotası illüstrasyonu"
          width={1200}
          height={800}
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="h-auto w-full max-w-full rounded-lg border border-border/70 object-cover"
        />

        <div className="lg:hidden">
          <Button asChild className="w-full sm:w-auto">
            <Link href={homeAboutContent.cta.href}>
              {homeAboutContent.cta.label}
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
