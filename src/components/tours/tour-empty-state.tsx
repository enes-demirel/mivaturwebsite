import { Button } from "@/components/ui/button";

export function TourEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-12 text-center sm:px-8 sm:py-16">
      <h2 className="text-2xl font-bold tracking-tight text-text">
        Aradığınız kriterlere uygun tur bulunamadı
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted sm:text-base">
        Filtreleri değiştirerek diğer tur programlarını inceleyebilirsiniz.
      </p>
      <Button type="button" className="mt-6" onClick={onClear}>
        Filtreleri Temizle
      </Button>
    </div>
  );
}
