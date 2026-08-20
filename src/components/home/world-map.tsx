"use client";

import { useMemo, useState } from "react";
import { geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import { DestinationMarker } from "@/components/home/destination-marker";
import type { Destination } from "@/types/destination";

const WIDTH=1120,HEIGHT=560;
const EUROPE_CODES=new Set(["AL","AT","BA","CZ","DE","ES","FR","GB","GR","HR","HU","IT","ME","MK","NL","RS","RU"]);
const EUROPE_GEOMETRY_IDS=new Set(["008","040","070","191","203","250","276","300","348","380","499","528","688","724","807","826"]);
type Mode="world"|"europe";
type Props={destinations:readonly Destination[]};

export function WorldMap({destinations}:Props){
  const [mode,setMode]=useState<Mode>("world");
  const model=useMemo(()=>buildMap(destinations,mode),[destinations,mode]);
  return <div className="flex h-[240px] w-full max-w-full items-center justify-center sm:h-[290px] lg:h-auto" role="group" aria-label={mode==="world"?"Destinasyon dünya haritası":"Avrupa destinasyon haritası"}>
    <div className="relative aspect-2/1 w-full max-w-[560px] lg:max-w-none">
      <svg className="absolute inset-0 h-full w-full overflow-hidden" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <path d={model.landPath??undefined} fill="var(--color-surface)" fillOpacity="0.82" stroke="var(--color-muted)" strokeOpacity="0.74" strokeWidth="1.05" vectorEffect="non-scaling-stroke" />
        <path d={model.borderPath??undefined} fill="none" stroke="var(--color-text)" strokeOpacity="0.52" strokeWidth="0.72" vectorEffect="non-scaling-stroke" />
        {model.positions.map(({destination,anchor,offset})=>(offset[0]||offset[1])?<line key={`${destination.slug}-line`} x1={anchor[0]} y1={anchor[1]} x2={anchor[0]+offset[0]} y2={anchor[1]+offset[1]} stroke="var(--color-brand)" strokeOpacity="0.23" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />:null)}
      </svg>
      {mode==="world"&&<button type="button" onClick={()=>setMode("europe")} aria-label="Avrupa haritasını aç" className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none" style={{left:`${model.euPosition?.[0]??50}%`,top:`${model.euPosition?.[1]??40}%`}}><span className="flex size-10 items-center justify-center rounded-full border-2 border-surface bg-surface shadow-md ring-1 ring-border transition group-hover:scale-105 group-hover:ring-brand group-focus-visible:ring-2 group-focus-visible:ring-brand"><EuFlag /></span><span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 w-max -translate-x-1/2 rounded-sm bg-text px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Avrupa&apos;yı Yakından Gör</span></button>}
      {mode==="europe"&&<button type="button" onClick={()=>setMode("world")} className="absolute top-1 left-1 z-30 inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-surface/95 px-3 text-xs font-bold text-text shadow-sm transition hover:border-brand/40 hover:text-brand focus-visible:outline-2 focus-visible:outline-brand">← Dünya Haritasına Dön</button>}
      {model.positions.map(({destination,position})=><DestinationMarker key={destination.slug} destination={destination} desktopPosition={position} mobilePosition={position} />)}
    </div>
  </div>;
}

function buildMap(destinations:readonly Destination[],mode:Mode){
  const topology=worldAtlas as unknown as Topology<{countries:GeometryCollection}>;
  const allCountries=feature(topology,topology.objects.countries);
  const geometries=topology.objects.countries.geometries;
  const byId=new Map(geometries.map((geometry)=>[String(geometry.id).padStart(3,"0"),geometry]));
  const europeFeatures=geometries.filter((geometry)=>EUROPE_GEOMETRY_IDS.has(String(geometry.id).padStart(3,"0"))).flatMap((geometry)=>{const country=feature(topology,geometry);return country.type==="Feature"?[country]:[];});
  const europeCollection={type:"FeatureCollection" as const,features:europeFeatures};
  const projection=geoNaturalEarth1();
  if(mode==="world")projection.fitExtent([[18,14],[WIDTH-18,HEIGHT-14]],{type:"Sphere"});
  else projection.fitExtent([[46,34],[WIDTH-38,HEIGHT-24]],europeCollection);
  const path=geoPath(projection);
  const visible=destinations.filter((destination)=>mode==="europe"?EUROPE_CODES.has(destination.countryCode):!EUROPE_CODES.has(destination.countryCode));
  const positions=visible.flatMap((destination)=>{
    const geometry=byId.get(destination.numericCountryId);if(!geometry)return[];
    const coordinates=destination.anchorCoordinates??geoCentroid(feature(topology,geometry));
    const anchor=projection([coordinates[0],coordinates[1]]);if(!anchor)return[];
    const offset=mode==="europe"?(destination.markerOffset??[0,0] as const):[0,0] as const;
    return[{destination,anchor,offset,position:[((anchor[0]+offset[0])/WIDTH)*100,((anchor[1]+offset[1])/HEIGHT)*100] as const}];
  });
  const europeAnchor=projection([12,50]);
  const borders=mesh(topology,topology.objects.countries,(a,b)=>a!==b&&(mode==="world"||(EUROPE_GEOMETRY_IDS.has(String(a.id).padStart(3,"0"))&&EUROPE_GEOMETRY_IDS.has(String(b.id).padStart(3,"0")))));
  return{positions,landPath:path(mode==="world"?allCountries:europeCollection),borderPath:path(borders),euPosition:europeAnchor?[europeAnchor[0]/WIDTH*100,europeAnchor[1]/HEIGHT*100] as const:null};
}

function EuFlag(){const stars=Array.from({length:12},(_,index)=>{const angle=index*Math.PI/6-Math.PI/2;return <circle key={index} cx={18+Math.cos(angle)*8} cy={12+Math.sin(angle)*8} r="1.15" fill="#ffcc00" />;});return <svg viewBox="0 0 36 24" className="h-full w-full overflow-hidden rounded-full" aria-hidden="true"><rect width="36" height="24" fill="#003399" />{stars}</svg>}
