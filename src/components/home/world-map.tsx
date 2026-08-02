import { geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

import { DestinationMarker } from "@/components/home/destination-marker";
import type { Destination } from "@/types/destination";

const MAP_WIDTH = 1120;
const MAP_HEIGHT = 560;
const TURKEY_COORDINATES: [number, number] = [28.98, 41.01];
const routeDestinationSlugs = ["italya", "fransa", "misir", "birlesik-arap-emirlikleri", "japonya"];

type WorldMapProps = {
  destinations: readonly Destination[];
};

export function WorldMap({ destinations }: WorldMapProps) {
  const topology = worldAtlas as unknown as Topology<{
    countries: GeometryCollection;
  }>;
  const countries = feature(topology, topology.objects.countries);
  const borders = mesh(
    topology,
    topology.objects.countries,
    (countryA, countryB) => countryA !== countryB,
  );
  const projection = geoNaturalEarth1().fitExtent(
    [
      [18, 14],
      [MAP_WIDTH - 18, MAP_HEIGHT - 14],
    ],
    { type: "Sphere" },
  );
  const path = geoPath(projection);
  const countryGeometriesById = new Map(
    topology.objects.countries.geometries.map((countryGeometry) => [
      String(countryGeometry.id).padStart(3, "0"),
      countryGeometry,
    ]),
  );

  const markerPositions = destinations.map((destination) => {
    const countryGeometry = countryGeometriesById.get(destination.numericCountryId);

    if (!countryGeometry) {
      throw new Error(
        `world-atlas feature bulunamadı: ${destination.name} (${destination.numericCountryId})`,
      );
    }

    const countryFeature = feature(topology, countryGeometry);
    const centroidCoordinates = geoCentroid(countryFeature);
    const projected = projection(centroidCoordinates);

    if (!projected) {
      throw new Error(`Ülke merkezi projeksiyona aktarılamadı: ${destination.name}`);
    }

    const desktopOffset = destination.markerOffset ?? [0, 0];
    const mobileOffset = destination.mobileMarkerOffset ?? desktopOffset;

    const toPercentPosition = (offset: readonly [number, number]) =>
      [
        ((projected[0] + offset[0]) / MAP_WIDTH) * 100,
        ((projected[1] + offset[1]) / MAP_HEIGHT) * 100,
      ] as const;

    return {
      destination,
      anchor: projected,
      centroidCoordinates,
      desktopPosition: toPercentPosition(desktopOffset),
      mobilePosition: toPercentPosition(mobileOffset),
      desktopOffset,
      mobileOffset,
    };
  });

  const routes = routeDestinationSlugs.flatMap((slug) => {
    const destinationMarker = markerPositions.find(
      ({ destination }) => destination.slug === slug,
    );

    if (!destinationMarker) return [];

    const route = {
      type: "LineString" as const,
      coordinates: [TURKEY_COORDINATES, destinationMarker.centroidCoordinates],
    };

    return [{ slug, path: path(route) }];
  });

  return (
    <div
      className="flex h-[220px] w-full max-w-full items-center justify-center sm:h-[270px] lg:h-auto"
      role="group"
      aria-label="Destinasyon dünya haritası"
    >
      <div className="relative aspect-2/1 w-full max-w-[540px] lg:max-w-none">
        <svg
          className="absolute inset-0 h-full w-full overflow-hidden"
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
        <defs>
          <radialGradient id="map-glow" cx="58%" cy="46%" r="55%">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.045" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="630" cy="285" rx="465" ry="235" fill="url(#map-glow)" />
        <path
          d={path(countries) ?? undefined}
          fill="var(--color-surface)"
          fillOpacity="0.78"
          stroke="#d8d4da"
          strokeWidth="0.9"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={path(borders) ?? undefined}
          fill="none"
          stroke="#cbc6ce"
          strokeOpacity="0.9"
          strokeWidth="0.68"
          vectorEffect="non-scaling-stroke"
        />
        {markerPositions.map(
          ({ destination, anchor, desktopOffset, mobileOffset }) => (
            <g key={`${destination.slug}-connector`}>
              {destination.mobileVisible &&
                (mobileOffset[0] !== 0 || mobileOffset[1] !== 0) && (
                  <line
                    className="lg:hidden"
                    x1={anchor[0]}
                    y1={anchor[1]}
                    x2={anchor[0] + mobileOffset[0]}
                    y2={anchor[1] + mobileOffset[1]}
                    stroke="var(--color-brand)"
                    strokeOpacity="0.18"
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              {(desktopOffset[0] !== 0 || desktopOffset[1] !== 0) && (
                <line
                  className="hidden lg:block"
                  x1={anchor[0]}
                  y1={anchor[1]}
                  x2={anchor[0] + desktopOffset[0]}
                  y2={anchor[1] + desktopOffset[1]}
                  stroke="var(--color-brand)"
                  strokeOpacity="0.16"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          ),
        )}
        {routes.map((route) => (
          <path
            key={route.slug}
            d={route.path ?? undefined}
            fill="none"
            stroke="var(--color-brand)"
            strokeDasharray="4 7"
            strokeLinecap="round"
            strokeOpacity="0.2"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle
          cx={projection(TURKEY_COORDINATES)?.[0]}
          cy={projection(TURKEY_COORDINATES)?.[1]}
          r="3"
          fill="var(--color-brand)"
          fillOpacity="0.55"
        />
        </svg>

        {markerPositions.map(
          ({ destination, desktopPosition, mobilePosition }) => (
            <DestinationMarker
              key={destination.slug}
              destination={destination}
              desktopPosition={desktopPosition}
              mobilePosition={mobilePosition}
            />
          ),
        )}
      </div>
    </div>
  );
}
