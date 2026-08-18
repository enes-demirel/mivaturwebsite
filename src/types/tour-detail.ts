import type { Currency } from "@/types/tour";
import type { TourDayTransfer, TourInstallmentPlan } from "@/types/tour-payment";

export type TourDepartureStatus = "available" | "planned" | "sold-out";

export type TourDeparture = {
  id: string;
  startDate: string;
  endDate: string;
  departureCity: string;
  arrivalPoint: string;
  price: number;
  currency: Currency;
  previousPrice?: number;
  singleRoomSupplement?: number;
  roomOccupancyLabel?: string;
  airline?: string;
  transportationNote: string;
  bookingTransportationLabel?: string;
  status: TourDepartureStatus;
};

export type TourItineraryDay = {
  id: string;
  dayNumber: number;
  title: string;
  route: string;
  summary: string;
  description: string;
  image?: string;
  imageAlt?: string;
  highlights: readonly string[];
  transportation: string;
  accommodation: string;
  meals: string;
};

export type TourFaq = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type TourGalleryImage = {
  src: string;
  alt: string;
};

export type TourDetail = {
  tourSlug: string;
  gallery: readonly TourGalleryImage[];
  shortDescription: string;
  longDescription: string;
  departures: readonly TourDeparture[];
  itinerary: readonly TourItineraryDay[];
  includedServices: readonly string[];
  excludedServices: readonly string[];
  importantNotes: ReadonlyArray<{ title: string; content: string }>;
  faq: readonly TourFaq[];
  pdfUrl: string | null;
  similarTourSlugs: readonly string[];
  visitedCountries: readonly string[];
  visitedCities: readonly string[];
  visaInformation: string;
  hotelInformation?: ReadonlyArray<{
    location: string;
    nights: number;
    description: string;
  }>;
  mealInformation?: readonly string[];
  visaFee?: number;
  guideDriverTip?: number;
  realContent?: boolean;
  installmentPlan?: TourInstallmentPlan;
  dayTransfers?: readonly TourDayTransfer[];
};
