export type DestinationCountryCode =
  | "AE"
  | "AL"
  | "AT"
  | "BA"
  | "CZ"
  | "DE"
  | "EG"
  | "ES"
  | "FR"
  | "GR"
  | "HR"
  | "HU"
  | "IT"
  | "JP"
  | "ME"
  | "MK"
  | "NL"
  | "RS";

export type Destination = {
  name: string;
  slug: string;
  countryCode: DestinationCountryCode;
  numericCountryId: string;
  coordinates: readonly [longitude: number, latitude: number];
  order: number;
  featured: boolean;
  mobileVisible: boolean;
  markerOffset?: readonly [x: number, y: number];
  mobileMarkerOffset?: readonly [x: number, y: number];
  tooltipAlign?: "left" | "center" | "right";
};
