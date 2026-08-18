"use client";

import { useState } from "react";

import type { TourInstallmentPlan } from "@/types/tour-payment";

const initialPlan: TourInstallmentPlan = { enabled: false, count: 2, installments: [{ installmentNumber: 1, dueDate: "" }, { installmentNumber: 2, dueDate: "" }] };

export function InstallmentPlanEditor() {
  const [plan, setPlan] = useState<TourInstallmentPlan>(initialPlan);

  function changeCount(count: number) {
    setPlan((current) => ({ ...current, count, installments: Array.from({ length: count }, (_, index) => current.installments[index] ?? { installmentNumber: index + 1, dueDate: "" }) }));
  }

  return <section className="rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby="installment-plan-admin-title"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 id="installment-plan-admin-title" className="text-xl font-bold text-text">Ödeme ve Taksit Planı</h2><p className="mt-1 text-sm text-muted">Taksit planı veri modeli için hazırlanan arayüz.</p></div><span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted">UI hazırlığı</span></div><label className="mt-5 flex min-h-11 items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={plan.enabled} onChange={(event) => setPlan((current) => ({ ...current, enabled: event.target.checked }))} className="size-4 accent-brand" />Bu tur için taksit planı var</label>{plan.enabled && <div className="mt-5 space-y-4 border-t border-border pt-5"><label htmlFor="installment-count" className="block max-w-xs text-sm font-semibold">Taksit Sayısı<select id="installment-count" value={plan.count} onChange={(event) => changeCount(Number(event.target.value))} className="mt-1.5 min-h-11 w-full rounded-md border border-border bg-background px-3 outline-none focus:border-brand">{Array.from({ length: 11 }, (_, index) => index + 2).map((count) => <option key={count} value={count}>{count} Taksit</option>)}</select></label><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{plan.installments.map((installment, index) => <label key={installment.installmentNumber} htmlFor={`installment-date-${installment.installmentNumber}`} className="rounded-md border border-border bg-background p-3 text-sm font-semibold">{installment.installmentNumber}. Taksit<input id={`installment-date-${installment.installmentNumber}`} type="date" value={installment.dueDate} onChange={(event) => setPlan((current) => ({ ...current, installments: current.installments.map((item, itemIndex) => itemIndex === index ? { ...item, dueDate: event.target.value } : item) }))} className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 outline-none focus:border-brand" /></label>)}</div><p className="text-xs leading-5 text-muted">Bu alanlar henüz veritabanına kaydedilmez.</p></div>}</section>;
}
