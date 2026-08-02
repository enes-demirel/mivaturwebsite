import type {
  TourType,
  TransportationType,
  VisaStatus,
} from "@/types/tour";

export type DurationRange = "one-day" | "two-four" | "five-seven" | "eight-plus";

export type TourFilterState = {
  query: string;
  types: readonly TourType[];
  destinations: readonly string[];
  departureCities: readonly string[];
  months: readonly string[];
  durations: readonly DurationRange[];
  visaStatuses: readonly VisaStatus[];
  transportationTypes: readonly TransportationType[];
};

export type TourFilterOptions = {
  destinations: readonly string[];
  departureCities: readonly string[];
  months: readonly string[];
};

export const emptyTourFilters: TourFilterState = {
  query: "",
  types: [],
  destinations: [],
  departureCities: [],
  months: [],
  durations: [],
  visaStatuses: [],
  transportationTypes: [],
};
