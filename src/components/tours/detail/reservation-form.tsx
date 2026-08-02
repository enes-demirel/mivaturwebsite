"use client";

import { useState } from "react";

import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { Button } from "@/components/ui/button";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ReservationForm({ tourSlug }: { tourSlug: string }) {
  const { selectedDeparture } = useTourDeparture();
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    // Demo submission only. Replace this boundary with a Server Action/Supabase insert.
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setStatus("success");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-base font-bold text-text">Rezervasyon talebi</h2>
      <input type="hidden" name="tourSlug" value={tourSlug} />
      <input type="hidden" name="departureId" value={selectedDeparture.id} />
      <div className="mt-4 space-y-3">
        <FormField id="reservation-name" label="Ad Soyad">
          <input id="reservation-name" name="name" autoComplete="name" required minLength={2} className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15" />
        </FormField>
        <FormField id="reservation-phone" label="Telefon">
          <input id="reservation-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15" />
        </FormField>
        <FormField id="reservation-note" label="Not">
          <textarea id="reservation-note" name="note" rows={3} className="w-full resize-y rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/15" />
        </FormField>
      </div>
      <Button type="submit" variant="secondary" className="mt-4 w-full" disabled={status === "loading"}>
        {status === "loading" ? "Gönderiliyor…" : "Talep Oluştur"}
      </Button>
      <div className="mt-3 min-h-6 text-sm" aria-live="polite">
        {status === "success" && <p className="text-emerald-700">Talebiniz demo olarak alındı. Entegrasyon tamamlandığında ekibe iletilecektir.</p>}
        {status === "error" && <p className="text-brand">Lütfen zorunlu alanları kontrol edin.</p>}
      </div>
    </form>
  );
}

function FormField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-text">{label}</label>
      {children}
    </div>
  );
}
