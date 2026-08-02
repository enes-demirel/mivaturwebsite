import { formatDepartureMonth } from "@/lib/filter-tours";
import type { TourFilterState } from "@/types/tour-filter";

type ActiveFilterChipsProps = {
  filters: TourFilterState;
  onChange: (filters: TourFilterState) => void;
};

const labels: Record<string, string> = {
  international: "Yurtdışı",
  domestic: "Yurtiçi",
  "one-day": "1 gün",
  "two-four": "2–4 gün",
  "five-seven": "5–7 gün",
  "eight-plus": "8 gün ve üzeri",
  "visa-free": "Vizesiz",
  "visa-required": "Vizeli",
  special: "Kapıda vize / özel durum",
  plane: "Uçak",
  bus: "Otobüs",
  mixed: "Karma",
};

export function ActiveFilterChips({ filters, onChange }: ActiveFilterChipsProps) {
  const chips = [
    ...(filters.query.trim()
      ? [{ key: "query", value: filters.query, label: `“${filters.query.trim()}”` }]
      : []),
    ...filters.types.map((value) => ({ key: "types", value, label: labels[value] })),
    ...filters.destinations.map((value) => ({ key: "destinations", value, label: value })),
    ...filters.departureCities.map((value) => ({ key: "departureCities", value, label: `${value} çıkışlı` })),
    ...filters.months.map((value) => ({ key: "months", value, label: formatDepartureMonth(value) })),
    ...filters.durations.map((value) => ({ key: "durations", value, label: labels[value] })),
    ...filters.visaStatuses.map((value) => ({ key: "visaStatuses", value, label: labels[value] })),
    ...filters.transportationTypes.map((value) => ({ key: "transportationTypes", value, label: labels[value] })),
  ] as const;

  if (chips.length === 0) return null;

  function removeChip(key: (typeof chips)[number]["key"], value: string) {
    if (key === "query") return onChange({ ...filters, query: "" });
    if (key === "types") return onChange({ ...filters, types: filters.types.filter((item) => item !== value) });
    if (key === "destinations") return onChange({ ...filters, destinations: filters.destinations.filter((item) => item !== value) });
    if (key === "departureCities") return onChange({ ...filters, departureCities: filters.departureCities.filter((item) => item !== value) });
    if (key === "months") return onChange({ ...filters, months: filters.months.filter((item) => item !== value) });
    if (key === "durations") return onChange({ ...filters, durations: filters.durations.filter((item) => item !== value) });
    if (key === "visaStatuses") return onChange({ ...filters, visaStatuses: filters.visaStatuses.filter((item) => item !== value) });
    return onChange({ ...filters, transportationTypes: filters.transportationTypes.filter((item) => item !== value) });
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Aktif filtreler">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          onClick={() => removeChip(chip.key, chip.value)}
          className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 text-xs font-bold text-text transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label={`${chip.label} filtresini kaldır`}
        >
          <span className="truncate">{chip.label}</span>
          <span aria-hidden="true" className="text-base leading-none text-brand">×</span>
        </button>
      ))}
    </div>
  );
}
