import Link from "next/link";
import {
  AE,
  AL,
  AT,
  BA,
  CZ,
  CN,
  DE,
  EG,
  ES,
  FR,
  GR,
  HR,
  HU,
  IT,
  JP,
  GB,
  ID,
  JO,
  KR,
  MA,
  ME,
  MK,
  NL,
  RS,
  QA,
  RU,
  TH,
} from "country-flag-icons/react/3x2";
import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import type { Destination, DestinationCountryCode } from "@/types/destination";

const flags: Record<DestinationCountryCode, typeof AE> = {
  AE,
  AL,
  AT,
  BA,
  CZ,
  CN,
  DE,
  EG,
  ES,
  FR,
  GR,
  HR,
  HU,
  IT,
  JP,
  GB,
  ID,
  JO,
  KR,
  MA,
  ME,
  MK,
  NL,
  RS,
  QA,
  RU,
  TH,
};

type DestinationMarkerProps = {
  destination: Destination;
  desktopPosition: readonly [x: number, y: number];
  mobilePosition: readonly [x: number, y: number];
};

type MarkerPositionStyles = CSSProperties & {
  "--marker-x": string;
  "--marker-y": string;
  "--marker-mobile-x": string;
  "--marker-mobile-y": string;
};

export function DestinationMarker({
  destination,
  desktopPosition,
  mobilePosition,
}: DestinationMarkerProps) {
  const Flag = flags[destination.countryCode];
  const tooltipAlignment = {
    left: "left-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
  }[destination.tooltipAlign ?? "center"];
  const markerPositionStyles: MarkerPositionStyles = {
    "--marker-x": `${desktopPosition[0]}%`,
    "--marker-y": `${desktopPosition[1]}%`,
    "--marker-mobile-x": `${mobilePosition[0]}%`,
    "--marker-mobile-y": `${mobilePosition[1]}%`,
  };

  return (
    <Link
      href={`/destinasyonlar/${destination.slug}`}
      aria-label={`${destination.name} destinasyonunu incele`}
      className={cn(
        "group absolute top-(--marker-mobile-y) left-(--marker-mobile-x) z-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none hover:z-30 focus-visible:z-30 lg:top-(--marker-y) lg:left-(--marker-x)",
        !destination.mobileVisible && "hidden lg:block",
      )}
      style={markerPositionStyles}
    >
      <span className="flex size-8 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface shadow-[0_3px_12px_rgb(37_35_41_/_0.16)] ring-1 ring-border transition-[transform,box-shadow] duration-200 group-hover:scale-105 group-hover:shadow-[0_0_0_3px_rgb(255_0_72_/_0.16)] group-focus-visible:scale-105 group-focus-visible:shadow-[0_0_0_4px_rgb(255_0_72_/_0.2)] sm:size-9">
        <Flag aria-hidden="true" className="h-full w-full object-cover" />
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-[calc(100%+0.5rem)] w-max max-w-[min(11rem,calc(100vw-2rem))] rounded-sm bg-text px-2.5 py-1.5 text-center text-xs leading-4 font-semibold whitespace-normal text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
          tooltipAlignment,
        )}
      >
        {destination.name}
      </span>
    </Link>
  );
}

export function DestinationFlag({ destination }: { destination: Destination }) {
  const Flag = flags[destination.countryCode];

  return (
    <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface shadow-sm ring-1 ring-border">
      <Flag aria-hidden="true" className="h-full w-full object-cover" />
    </span>
  );
}
