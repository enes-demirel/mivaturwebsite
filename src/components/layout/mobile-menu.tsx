"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { NavigationItem } from "@/types/navigation";
import { siteConfig } from "@/data/site-config";

type MobileMenuProps = {
  items: readonly NavigationItem[];
};

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef(pathname);

  function closeMenu({ restoreFocus = true } = {}) {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

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

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="xl:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface text-text transition-colors hover:border-brand hover:text-brand"
        aria-label="Menüyü aç"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Menüyü aç</span>
        <MenuIcon />
      </button>

      {isOpen && createPortal(
        <>
          <button
            type="button"
            className="fixed inset-0 z-[80] cursor-default bg-black/30 backdrop-blur-[1px]"
            aria-label="Menüyü kapat"
            onClick={() => closeMenu()}
          />
          <div
            ref={dialogRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon"
            className="fixed inset-y-0 right-0 z-[90] flex w-[min(88vw,390px)] max-w-full flex-col overflow-hidden border-l border-border bg-surface shadow-[-16px_0_40px_rgb(37_35_41_/_0.14)]"
          >
            <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-5 sm:px-6">
              <span className="text-base font-extrabold text-text">Menü</span>
              <button
                type="button"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border text-text outline-none transition-colors hover:border-brand hover:text-brand focus-visible:ring-3 focus-visible:ring-brand/20"
                aria-label="Menüyü kapat"
                onClick={() => closeMenu()}
              >
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Mobil ana navigasyon" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3 sm:px-6">
              <ul className="flex flex-col divide-y divide-border">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex min-h-13 w-full items-center py-3 text-[0.9375rem] font-semibold text-text outline-none transition-colors hover:text-brand focus-visible:text-brand"
                      onClick={() => closeMenu({ restoreFocus: false })}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="shrink-0 border-t border-border px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"><a href={`tel:${siteConfig.phone}`} aria-label={`Mivatur'u ara: ${siteConfig.phoneDisplay}`} className="flex min-h-14 w-full items-center gap-3 rounded-lg bg-brand px-4 text-white outline-none transition-colors hover:bg-[var(--color-brand-hover)] hover:text-white focus-visible:text-white focus-visible:ring-3 focus-visible:ring-brand/25 focus-visible:ring-offset-2"><PhoneIcon /><span className="min-w-0 text-white"><span className="block text-sm font-extrabold text-white">Mivatur&apos;u Ara</span><span className="mt-0.5 block text-sm font-semibold text-white">{siteConfig.phoneDisplay}</span></span></a></div>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

function PhoneIcon() { return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-white"><path d="M7.2 3.5 10 8.4 7.8 10a15.5 15.5 0 0 0 6.2 6.2l1.6-2.2 4.9 2.8-.8 3a2 2 0 0 1-2.1 1.5C9.7 20.4 3.6 14.3 2.7 6.4a2 2 0 0 1 1.5-2.1l3-.8Z" /></svg>; }

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d="m6 6 12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
