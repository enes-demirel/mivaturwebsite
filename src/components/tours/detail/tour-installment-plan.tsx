import type { TourInstallmentPlan } from "@/types/tour-payment";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export function TourInstallmentPlanCard({ plan }: { plan?: TourInstallmentPlan }) {
  if (!plan?.enabled || plan.installments.length === 0) return null;
  return <section aria-labelledby="installment-plan-title" className="rounded-lg border border-border bg-surface p-5 shadow-card"><div className="border-l-2 border-brand pl-3"><h2 id="installment-plan-title" className="font-extrabold text-text">Taksitli Ödeme Planı</h2><p className="mt-1 text-sm leading-6 text-muted">Bu tur için belirlenen ödeme tarihlerini aşağıda inceleyebilirsiniz.</p></div><dl className="mt-4 divide-y divide-border">{plan.installments.map((installment) => <div key={installment.installmentNumber} className="flex items-center justify-between gap-4 py-3 text-sm"><dt className="font-bold text-text">{installment.installmentNumber}. Taksit</dt><dd className="text-right font-semibold text-muted">{formatDate(installment.dueDate)}</dd></div>)}</dl></section>;
}

function formatDate(value: string) { const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date); }
