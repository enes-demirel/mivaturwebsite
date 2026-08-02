import Link from "next/link";

import { TourCard } from "@/components/tours/tour-card";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import type { Tour } from "@/types/tour";

type FeaturedToursSectionProps = {
  title: string;
  eyebrow: string;
  description: string;
  tours: readonly Tour[];
  viewAllHref: string;
  viewAllLabel: string;
  gridVariant: "four-column" | "two-column";
  className?: string;
};

export function FeaturedToursSection({
  title,
  eyebrow,
  description,
  tours,
  viewAllHref,
  viewAllLabel,
  gridVariant,
  className,
}: FeaturedToursSectionProps) {
  return (
    <Section className={cn("py-14 sm:py-16 lg:py-20", className)}>
      <SectionHeading
        title={title}
        eyebrow={eyebrow}
        description={description}
      />

      <div
        className={cn(
          "mt-8 grid items-stretch gap-5 sm:mt-10 lg:gap-6",
          gridVariant === "four-column"
            ? "md:grid-cols-2 xl:grid-cols-4"
            : "md:grid-cols-2 md:max-w-[1000px]",
        )}
      >
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      <Button asChild variant="secondary" className="mt-8 w-full sm:w-auto">
        <Link href={viewAllHref}>{viewAllLabel}</Link>
      </Button>
    </Section>
  );
}
