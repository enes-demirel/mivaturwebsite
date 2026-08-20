export type DestinationCountryCode =
  | "AE"
  | "AL"
  | "AT"
  | "BA"
  | "CZ"
  | "CN"
  | "DE"
  | "EG"
  | "GB"
  | "ID"
  | "JO"
  | "KR"
  | "MA"
  | "QA"
  | "RU"
  | "TH"
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
  anchorCoordinates?: readonly [longitude: number, latitude: number];
};
