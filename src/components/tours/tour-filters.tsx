import { formatDepartureMonth } from "@/lib/filter-tours";
import type { TourFilterOptions, TourFilterState } from "@/types/tour-filter";

type TourFiltersProps = {
  filters: TourFilterState;
  options: TourFilterOptions;
  showTypeFilter: boolean;
  idPrefix: string;
  onChange: (filters: TourFilterState) => void;
};

const durationOptions = [
  ["one-day", "1 gün"],
  ["two-four", "2–4 gün"],
  ["five-seven", "5–7 gün"],
  ["eight-plus", "8 gün ve üzeri"],
] as const;

const visaOptions = [
  ["visa-free", "Vizesiz"],
  ["visa-required", "Vizeli"],
  ["special", "Kapıda vize / özel durum"],
] as const;

const transportationOptions = [
  ["plane", "Uçak"],
  ["bus", "Otobüs"],
  ["mixed", "Karma"],
] as const;

function toggleValue<T extends string>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function TourFilters({
  filters,
  options,
  showTypeFilter,
  idPrefix,
  onChange,
}: TourFiltersProps) {
  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div>
        <label htmlFor={`${idPrefix}-search`} className="text-sm font-bold text-text">
          Tur arama
        </label>
        <input
          id={`${idPrefix}-search`}
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Tur, ülke veya şehir"
          className="mt-2 min-h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm text-text outline-none placeholder:text-muted/75 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15"
        />
      </div>

      {showTypeFilter && (
        <FilterGroup legend="Tur türü">
          <FilterCheckbox id={`${idPrefix}-international`} label="Yurtdışı" checked={filters.types.includes("international")} onChange={() => onChange({ ...filters, types: toggleValue(filters.types, "international") })} />
          <FilterCheckbox id={`${idPrefix}-domestic`} label="Yurtiçi" checked={filters.types.includes("domestic")} onChange={() => onChange({ ...filters, types: toggleValue(filters.types, "domestic") })} />
        </FilterGroup>
      )}

      <FilterGroup legend="Bölge / ülke" scrollable>
        {options.destinations.map((destination) => (
          <FilterCheckbox key={destination} id={`${idPrefix}-destination-${destination}`} label={destination} checked={filters.destinations.includes(destination)} onChange={() => onChange({ ...filters, destinations: toggleValue(filters.destinations, destination) })} />
        ))}
      </FilterGroup>

      <FilterGroup legend="Çıkış şehri">
        {options.departureCities.map((city) => (
          <FilterCheckbox key={city} id={`${idPrefix}-departure-${city}`} label={city} checked={filters.departureCities.includes(city)} onChange={() => onChange({ ...filters, departureCities: toggleValue(filters.departureCities, city) })} />
        ))}
      </FilterGroup>

      <FilterGroup legend="Seyahat ayı" scrollable>
        {options.months.map((month) => (
          <FilterCheckbox key={month} id={`${idPrefix}-month-${month}`} label={formatDepartureMonth(month)} checked={filters.months.includes(month)} onChange={() => onChange({ ...filters, months: toggleValue(filters.months, month) })} />
        ))}
      </FilterGroup>

      <FilterGroup legend="Tur süresi">
        {durationOptions.map(([value, label]) => (
          <FilterCheckbox key={value} id={`${idPrefix}-duration-${value}`} label={label} checked={filters.durations.includes(value)} onChange={() => onChange({ ...filters, durations: toggleValue(filters.durations, value) })} />
        ))}
      </FilterGroup>

      <FilterGroup legend="Vize durumu">
        {visaOptions.map(([value, label]) => (
          <FilterCheckbox key={value} id={`${idPrefix}-visa-${value}`} label={label} checked={filters.visaStatuses.includes(value)} onChange={() => onChange({ ...filters, visaStatuses: toggleValue(filters.visaStatuses, value) })} />
        ))}
      </FilterGroup>

      <FilterGroup legend="Ulaşım türü">
        {transportationOptions.map(([value, label]) => (
          <FilterCheckbox key={value} id={`${idPrefix}-transport-${value}`} label={label} checked={filters.transportationTypes.includes(value)} onChange={() => onChange({ ...filters, transportationTypes: toggleValue(filters.transportationTypes, value) })} />
        ))}
      </FilterGroup>
    </form>
  );
}

function FilterGroup({ legend, scrollable = false, children }: { legend: string; scrollable?: boolean; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-5">
      <legend className="px-0 text-sm font-bold text-text">{legend}</legend>
      <div className={`mt-3 space-y-2.5 ${scrollable ? "max-h-44 overflow-y-auto overscroll-contain pr-2" : ""}`}>
        {children}
      </div>
    </fieldset>
  );
}

function FilterCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label htmlFor={id} className="flex min-h-8 cursor-pointer items-start gap-2.5 text-sm leading-5 text-muted hover:text-text">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 size-4 shrink-0 accent-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" />
      <span className="min-w-0 break-words">{label}</span>
    </label>
  );
}
