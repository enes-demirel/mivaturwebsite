import Link from "next/link";

import { TourListingClient } from "@/components/tours/tour-listing-client";
import { Container } from "@/components/ui/container";
import type { Tour } from "@/types/tour";

type TourListingPageProps = {
  title: string;
  description: string;
  tours: readonly Tour[];
  showTypeFilter?: boolean;
};

export function TourListingPage({
  title,
  description,
  tours,
  showTypeFilter = true,
}: TourListingPageProps) {
  return (
    <Container className="py-14 sm:py-18 lg:py-22">
      <nav aria-label="Sayfa yolu" className="mb-7 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-brand focus-visible:outline-brand">
              Ana Sayfa
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-text">
            {title}
          </li>
        </ol>
      </nav>
      <header className="max-w-2xl">
        <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
          Mivatur Turları
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          {description}
        </p>
      </header>

      <TourListingClient tours={tours} showTypeFilter={showTypeFilter} />
    </Container>
  );
}
