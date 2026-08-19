"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { NavigationItem } from "@/types/navigation";
import { siteConfig } from "@/data/site-config";

type MobileMenuProps = {
  items: readonly NavigationItem[];
};

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function closeMenu({ restoreFocus = true } = {}) {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

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

      {isOpen && (
        <div className="fixed inset-0 z-50" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-text/30 backdrop-blur-[2px]"
            aria-label="Menüyü kapat"
            onClick={() => closeMenu()}
          />
          <div
            ref={dialogRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-5">
              <span className="text-base font-bold">Menü</span>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-md border border-border transition-colors hover:border-brand hover:text-brand"
                aria-label="Menüyü kapat"
                onClick={() => closeMenu()}
              >
                <CloseIcon />
              </button>
            </div>
            <nav aria-label="Mobil ana navigasyon" className="mt-6">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block border-b border-border py-4 text-base font-semibold transition-colors hover:text-brand"
                      onClick={() => closeMenu({ restoreFocus: false })}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a href={`tel:${siteConfig.phone}`} aria-label={`Mivatur'u ara: ${siteConfig.phoneDisplay}`} className="mt-auto flex min-h-16 items-center gap-3 rounded-lg bg-brand px-4 text-white transition-colors hover:bg-[var(--color-brand-hover)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand"><PhoneIcon /><span><span className="block text-sm font-extrabold">Mivatur&apos;u Ara</span><span className="mt-0.5 block text-sm font-semibold text-white/90">{siteConfig.phoneDisplay}</span></span></a>
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneIcon() { return <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.2 3.5 10 8.4 7.8 10a15.5 15.5 0 0 0 6.2 6.2l1.6-2.2 4.9 2.8-.8 3a2 2 0 0 1-2.1 1.5C9.7 20.4 3.6 14.3 2.7 6.4a2 2 0 0 1 1.5-2.1l3-.8Z" /></svg>; }

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
