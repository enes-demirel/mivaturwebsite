import { TourCard } from "@/components/tours/tour-card";
import type { Tour } from "@/types/tour";

export function TourResultsGrid({ tours }: { tours: readonly Tour[] }) {
  return (
    <div className="grid min-w-0 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
