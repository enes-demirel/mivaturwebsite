import Link from "next/link";

import { DestinationFlag } from "@/components/home/destination-marker";
import type { Destination } from "@/types/destination";

type MobileDestinationStripProps = {
  destinations: readonly Destination[];
};

export function MobileDestinationStrip({
  destinations,
}: MobileDestinationStripProps) {
  return (
    <div className="min-w-0 max-w-full lg:hidden">
      <p className="mb-3 text-xs font-bold tracking-[0.1em] text-muted uppercase">
        Popüler destinasyonlar
      </p>
      <nav aria-label="Popüler destinasyonlar">
        <ul className="destination-strip flex w-full max-w-full snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2">
          {destinations.map((destination) => (
            <li key={destination.slug} className="shrink-0 snap-start">
              <Link
                href={`/destinasyonlar/${destination.slug}`}
                className="flex min-h-11 items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 py-2 text-sm font-semibold shadow-[0_3px_14px_rgb(37_35_41_/_0.04)] transition-colors hover:border-brand/40 hover:text-brand focus-visible:border-brand"
              >
                <DestinationFlag destination={destination} />
                <span>{destination.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
