import type { Tour } from "@/types/tour";
import type {
  DurationRange,
  TourFilterOptions,
  TourFilterState,
} from "@/types/tour-filter";

export const monthFormatter = new Intl.DateTimeFormat("tr-TR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function normalizeSearchValue(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ı/g, "i");
}

export function getDepartureMonth(date: string) {
  return date.slice(0, 7);
}

export function formatDepartureMonth(month: string) {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}

export function getTourFilterOptions(tours: readonly Tour[]): TourFilterOptions {
  const destinations = new Set<string>();
  const departureCities = new Set<string>();
  const months = new Set<string>();

  tours.forEach((tour) => {
    destinations.add(tour.region);
    tour.countries.forEach((country) => destinations.add(country));
    tour.departureCities.forEach((city) => departureCities.add(city));
    tour.departureDates.forEach((date) => months.add(getDepartureMonth(date)));
  });

  return {
    destinations: [...destinations].sort((a, b) => a.localeCompare(b, "tr")),
    departureCities: [...departureCities].sort((a, b) =>
      a.localeCompare(b, "tr"),
    ),
    months: [...months].sort(),
  };
}

function matchesDuration(days: number, ranges: readonly DurationRange[]) {
  if (ranges.length === 0) return true;

  return ranges.some((range) => {
    if (range === "one-day") return days === 1;
    if (range === "two-four") return days >= 2 && days <= 4;
    if (range === "five-seven") return days >= 5 && days <= 7;
    return days >= 8;
  });
}

export function filterTours(
  tours: readonly Tour[],
  filters: TourFilterState,
) {
  const normalizedQuery = normalizeSearchValue(filters.query.trim());

  return tours.filter((tour) => {
    const searchableContent = normalizeSearchValue(
      [
        tour.title,
        tour.region,
        ...tour.countries,
        ...tour.cities,
        ...tour.categories,
      ].join(" "),
    );
    const destinations = [tour.region, ...tour.countries];
    const tourMonths = tour.departureDates.map(getDepartureMonth);

    return (
      (!normalizedQuery || searchableContent.includes(normalizedQuery)) &&
      (filters.types.length === 0 || filters.types.includes(tour.type)) &&
      (filters.destinations.length === 0 ||
        filters.destinations.some((value) => destinations.includes(value))) &&
      (filters.departureCities.length === 0 ||
        filters.departureCities.some((value) =>
          tour.departureCities.includes(value),
        )) &&
      (filters.months.length === 0 ||
        filters.months.some((value) => tourMonths.includes(value))) &&
      matchesDuration(tour.durationDays, filters.durations) &&
      (filters.visaStatuses.length === 0 ||
        filters.visaStatuses.includes(tour.visaStatus)) &&
      (filters.transportationTypes.length === 0 ||
        filters.transportationTypes.includes(tour.transportationType))
    );
  });
}

export function countActiveFilters(filters: TourFilterState) {
  return (
    (filters.query.trim() ? 1 : 0) +
    filters.types.length +
    filters.destinations.length +
    filters.departureCities.length +
    filters.months.length +
    filters.durations.length +
    filters.visaStatuses.length +
    filters.transportationTypes.length
  );
}
