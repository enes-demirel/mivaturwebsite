export type TourType = "international" | "domestic";
export type Currency = "TRY" | "EUR" | "USD";
export type TourCurrency = Currency;
export type TransportationType = "plane" | "bus" | "train" | "mixed";
export type VisaStatus = "visa-free" | "visa-required" | "special";
export type TourCategory =
  | "culture"
  | "nature"
  | "city"
  | "coast"
  | "discovery";

export type Tour = {
  id: string;
  title: string;
  slug: string;
  type: TourType;
  image: string;
  imageAlt: string;
  durationDays: number;
  durationNights: number;
  nearestDepartureDate: string;
  departureCount: number;
  price: number;
  currency: TourCurrency;
  pricePrefix: string;
  badges: readonly string[];
  featured: boolean;
  order: number;
  region: string;
  countries: readonly string[];
  cities: readonly string[];
  departureCities: readonly string[];
  categories: readonly TourCategory[];
  departureDates: readonly string[];
  visaRequired: boolean;
  visaStatus: VisaStatus;
  transportationType: TransportationType;
  realContent?: boolean;
};
