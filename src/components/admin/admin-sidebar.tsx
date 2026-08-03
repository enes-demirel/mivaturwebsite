import Link from "next/link";

import { logoutAction } from "@/app/admin/(protected)/actions";
import { Logo } from "@/components/layout/logo";
import { adminNavigationItems } from "@/data/admin-navigation";

export function AdminSidebar({ email }: { email: string | null }) {
  return (
    <aside className="hidden min-h-dvh border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="border-b border-border px-6 py-5">
        <Logo priority />
      </div>
      <nav aria-label="Admin navigasyonu" className="flex-1 px-4 py-6">
        <ul className="space-y-1.5">
          {adminNavigationItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link href={item.href} className="flex min-h-11 items-center rounded-md bg-brand/5 px-3 text-sm font-bold text-brand">
                  {item.label}
                </Link>
              ) : (
                <div className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm font-semibold text-muted" aria-disabled="true">
                  <span>{item.label}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide">Yakında</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-border p-4">
        {email && <p className="truncate px-2 text-xs text-muted" title={email}>{email}</p>}
        <form action={logoutAction} className="mt-3">
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border text-sm font-bold text-text transition-colors hover:border-brand hover:text-brand">
            Çıkış Yap
          </button>
        </form>
      </div>
    </aside>
  );
}
