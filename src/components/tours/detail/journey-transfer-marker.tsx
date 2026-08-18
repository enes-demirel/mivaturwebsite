import type { TourDayTransfer, TourDayTransferMode } from "@/types/tour-payment";

const labels: Record<TourDayTransferMode, string> = { plane: "Uçak", train: "Tren", bus: "Otobüs", ship: "Gemi" };

export function JourneyTransferMarker({ transfer, desktop = false }: { transfer: TourDayTransfer; desktop?: boolean }) {
  return <div className={`flex items-center gap-2 ${desktop ? "justify-center" : "py-1 pl-1"}`} aria-label={`${transfer.fromDayNumber}. ve ${transfer.toDayNumber}. gün arası ${labels[transfer.transportMode]}${transfer.distanceKm ? `, ${transfer.distanceKm} kilometre` : ""}`}><span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-brand/20 bg-surface px-3 text-xs font-extrabold text-text shadow-[0_4px_16px_rgb(37_35_41_/_0.05)]"><TransportIcon mode={transfer.transportMode} /><span>{labels[transfer.transportMode]}</span></span>{transfer.distanceKm && <span className="text-xs font-bold whitespace-nowrap text-muted">{transfer.distanceKm.toLocaleString("tr-TR")} km</span>}</div>;
}

function TransportIcon({ mode }: { mode: TourDayTransferMode }) {
  const paths: Record<TourDayTransferMode, React.ReactNode> = {
    plane: <path d="m3 12 18-7-6 7 6 7-18-7Zm12 0H7m8 0-4-7m4 7-4 7" />,
    train: <path d="M7 3h10a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Zm-2 9h14M8 21l2-3m6 0 2 3M8 7h8" />,
    bus: <path d="M6 3h12a2 2 0 0 1 2 2v12H4V5a2 2 0 0 1 2-2Zm-2 8h16M7 20v-3m10 3v-3M7 7h10" />,
    ship: <path d="m4 13 2-6h12l2 6-8 7-8-7Zm8-10v4m-3-2h6M3 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1" />,
  };
  return <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-brand">{paths[mode]}</svg>;
}
