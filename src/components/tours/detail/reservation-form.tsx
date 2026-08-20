"use client";

import { useState } from "react";
import Link from "next/link";

import { useTourDeparture } from "@/components/tours/detail/tour-departure-provider";
import { Button } from "@/components/ui/button";
import { submitReservationAction } from "@/app/(public)/actions";

type FormStatus = "idle" | "loading" | "success" | "error";

export function ReservationForm({ tourSlug }: { tourSlug: string }) {
  const { selectedDeparture } = useTourDeparture();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [startedAt] = useState(() => Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    const result = await submitReservationAction(new FormData(form));
    setMessage(result.message);
    setStatus(result.success ? "success" : "error");
    if (result.success) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-base font-bold text-text">Rezervasyon talebi</h2>
      <input type="hidden" name="tourSlug" value={tourSlug} />
      <input type="hidden" name="departureId" value={selectedDeparture.id} />
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="reservation-website">Website</label><input id="reservation-website" name="website" tabIndex={-1} autoComplete="off" /></div>
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
      <label className="mt-4 flex items-start gap-2.5 text-xs leading-5 text-muted"><input type="checkbox" name="kvkkAcknowledgement" required className="mt-1 size-4 shrink-0 accent-brand" /><span><Link href="/kvkk-aydinlatma-metni" target="_blank" className="font-semibold text-brand underline-offset-2 hover:underline">KVKK Aydınlatma Metni&apos;ni</Link> okudum ve kişisel verilerimin işlenmesi hakkında bilgi edindim.</span></label>
      <Button type="submit" variant="secondary" className="mt-4 w-full" disabled={status === "loading"}>
        {status === "loading" ? "Gönderiliyor…" : "Talep Oluştur"}
      </Button>
      <div className="mt-3 min-h-6 text-sm" aria-live="polite">
        {status === "success" && <p className="text-emerald-700">{message}</p>}
        {status === "error" && <p className="text-brand">{message || "Lütfen zorunlu alanları kontrol edin."}</p>}
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
