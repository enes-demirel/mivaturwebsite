import { archiveTourAction, moveTourToDraftAction, publishTourAction } from "@/app/admin/(protected)/turlar/actions";

export function TourStatusActions({ id, status }: { id: string; status: string }) {
  return <div className="flex flex-wrap gap-2">{status !== "published" && <ActionForm action={publishTourAction} id={id} label="Yayınla" primary />}{status !== "draft" && <ActionForm action={moveTourToDraftAction} id={id} label="Taslağa Al" />}{status !== "archived" && <ActionForm action={archiveTourAction} id={id} label="Arşivle" />}</div>;
}

function ActionForm({ action, id, label, primary = false }: { action: (formData: FormData) => Promise<void>; id: string; label: string; primary?: boolean }) {
  return <form action={action}><input type="hidden" name="id" value={id} /><button type="submit" className={`min-h-10 rounded-md border px-4 text-sm font-bold ${primary ? "border-brand bg-brand text-white" : "border-border bg-surface text-text hover:border-brand"}`}>{label}</button></form>;
}
