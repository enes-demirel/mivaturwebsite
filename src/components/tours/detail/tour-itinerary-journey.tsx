"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { TourItineraryDay } from "@/types/tour-detail";

export function TourItineraryJourney({ days }: { days: readonly TourItineraryDay[] }) {
  const [selectedDay, setSelectedDay] = useState<TourItineraryDay | null>(null);
  const journey = createJourneyLayout(days.length);

  return (
    <>
      <div className="relative hidden md:block" style={{ height: journey.height }}>
        <svg aria-hidden="true" viewBox={`0 0 1000 ${journey.height}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <path d={journey.path} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 11" strokeLinecap="round" className="text-brand/25" />
        </svg>
        {days.map((day, index) => (
          <div key={day.id} className="absolute w-[29%] max-w-64 -translate-x-1/2 -translate-y-1/2" style={{ left: `${journey.points[index].x / 10}%`, top: journey.points[index].y }}>
            <DayNode day={day} onSelect={setSelectedDay} emphasized={index === 0} desktop />
          </div>
        ))}
      </div>

      <div className="relative space-y-3 pl-6 md:hidden">
        <div aria-hidden="true" className="absolute top-5 bottom-5 left-2 border-l border-dashed border-brand/30" />
        {days.map((day, index) => (
          <DayNode key={day.id} day={day} onSelect={setSelectedDay} emphasized={index === 0} mobile />
        ))}
      </div>

      <TourDayModal day={selectedDay} onClose={() => setSelectedDay(null)} />
    </>
  );
}

function DayNode({ day, onSelect, emphasized, mobile = false, desktop = false }: { day: TourItineraryDay; onSelect: (day: TourItineraryDay) => void; emphasized: boolean; mobile?: boolean; desktop?: boolean }) {
  return (
    <button type="button" onClick={() => onSelect(day)} className={`group relative min-h-24 w-full rounded-lg border bg-surface p-4 text-left shadow-[0_8px_24px_rgb(37_35_41_/_0.045)] outline-none transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-brand/35 focus-visible:ring-3 focus-visible:ring-brand/25 motion-reduce:transform-none motion-reduce:transition-none ${emphasized ? "border-brand/30" : "border-border"} ${mobile ? "min-h-20" : ""}`}>
      <span aria-hidden="true" className={`absolute size-3 rounded-full border-2 border-surface bg-brand ${desktop ? "-top-1.5 left-1/2 -translate-x-1/2" : "top-1/2 -left-[1.72rem] -translate-y-1/2"}`} />
      <span className="text-xs font-extrabold tracking-[0.12em] text-brand uppercase">{day.dayNumber}. Gün</span>
      <span className="mt-2 block text-sm leading-6 font-bold text-text group-hover:text-brand">{day.route}</span>
    </button>
  );
}

function createJourneyLayout(dayCount: number) {
  const columns = Math.min(3, dayCount);
  const rows = Math.ceil(dayCount / columns);
  const rowGap = 190;
  const top = 70;
  const height = top * 2 + Math.max(0, rows - 1) * rowGap;
  const points = Array.from({ length: dayCount }, (_, index) => {
    const row = Math.floor(index / columns);
    const positionInRow = index % columns;
    const column = row % 2 === 0 ? positionInRow : columns - 1 - positionInRow;
    return {
      x: ((column + 0.5) / columns) * 1000,
      y: top + row * rowGap,
    };
  });
  const path = points.reduce((value, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const middleX = (previous.x + point.x) / 2;
    return `${value} C ${middleX} ${previous.y}, ${middleX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  return { points, path, height };
}

function TourDayModal({ day, onClose }: { day: TourItineraryDay | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (day && !dialog.open) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      return () => {
        document.body.style.overflow = previousOverflow;
        if (dialog.open) dialog.close();
      };
    }
  }, [day]);

  if (!day) return null;

  return (
    <dialog ref={dialogRef} onClose={onClose} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }} aria-labelledby={`day-modal-${day.id}`} className="m-auto max-h-[90svh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg border border-border bg-surface p-0 text-text shadow-2xl backdrop:bg-text/40">
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-7">
        <div><p className="text-xs font-extrabold tracking-[0.12em] text-brand uppercase">{day.dayNumber}. Gün</p><h3 id={`day-modal-${day.id}`} className="mt-1 text-xl font-bold text-text sm:text-2xl">{day.route}</h3></div>
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Gün detayını kapat" className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-xl hover:border-brand">×</button>
      </div>
      <div className="p-5 sm:p-7">
        {day.image && day.imageAlt && <div className="relative mb-6 aspect-[8/5] overflow-hidden rounded-lg"><Image src={day.image} alt={day.imageAlt} fill sizes="700px" className="object-cover" /></div>}
        <p className="text-lg font-bold text-text">{day.title}</p>
        <p className="mt-2 leading-7 text-muted">{day.summary}</p>
        <div className="mt-6"><h4 className="font-bold text-text">Öne çıkan duraklar</h4><ul className="mt-3 grid gap-2 sm:grid-cols-2">{day.highlights.map((highlight) => <li key={highlight} className="flex gap-2 text-sm text-muted"><span aria-hidden="true" className="text-brand">•</span>{highlight}</li>)}</ul></div>
        <div className="mt-6 border-t border-border pt-6"><h4 className="font-bold text-text">Günün programı</h4><div className="mt-3 space-y-4 leading-7 text-muted">{day.description.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
        <dl className="mt-6 grid gap-4 rounded-lg bg-background p-4 text-sm sm:grid-cols-3"><div><dt className="text-muted">Ulaşım</dt><dd className="mt-1 font-semibold">{day.transportation}</dd></div><div><dt className="text-muted">Konaklama</dt><dd className="mt-1 font-semibold">{day.accommodation}</dd></div><div><dt className="text-muted">Yemek</dt><dd className="mt-1 font-semibold">{day.meals}</dd></div></dl>
      </div>
    </dialog>
  );
}
