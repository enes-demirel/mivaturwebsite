"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { logoutAction } from "@/app/admin/(protected)/actions";
import { Logo } from "@/components/layout/logo";
import { adminNavigationItems } from "@/data/admin-navigation";

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AdminMobileMenu({ email }: { email: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) items-center justify-between border-b border-border bg-surface/95 px-5 backdrop-blur-md lg:hidden">
      <Logo priority />
      <button ref={triggerRef} type="button" aria-label="Admin menüsünü aç" aria-expanded={isOpen} aria-controls="admin-mobile-navigation" onClick={() => setIsOpen(true)} className="inline-flex size-11 items-center justify-center rounded-md border border-border text-text hover:border-brand">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <button type="button" className="absolute inset-0 bg-text/30" aria-label="Admin menüsünü kapat" onClick={() => closeMenu()} />
          <div ref={dialogRef} id="admin-mobile-navigation" role="dialog" aria-modal="true" aria-label="Admin navigasyonu" className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-bold text-text">Yönetim menüsü</span>
              <button type="button" aria-label="Admin menüsünü kapat" onClick={() => closeMenu()} className="inline-flex size-11 items-center justify-center rounded-md border border-border text-xl">×</button>
            </div>
            <nav className="mt-5 flex-1" aria-label="Mobil admin navigasyonu">
              <ul className="space-y-1">
                {adminNavigationItems.map((item) => <li key={item.label}>{item.href ? <Link href={item.href} onClick={() => closeMenu(false)} className="block min-h-11 rounded-md bg-brand/5 px-3 py-3 text-sm font-bold text-brand">{item.label}</Link> : <div className="flex min-h-11 items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-muted" aria-disabled="true"><span>{item.label}</span><span className="text-[0.625rem] font-bold uppercase">Yakında</span></div>}</li>)}
              </ul>
            </nav>
            <div className="border-t border-border pt-4">
              {email && <p className="truncate text-xs text-muted">{email}</p>}
              <form action={logoutAction} className="mt-3"><button type="submit" className="min-h-11 w-full rounded-md border border-border text-sm font-bold">Çıkış Yap</button></form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
