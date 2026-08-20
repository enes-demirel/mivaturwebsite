"use client";

import { usePathname } from "next/navigation";
import { createSiteWhatsAppUrl } from "@/data/site-config";

export function FloatingWhatsApp() {
  const pathname = usePathname();

  // Tour details already provide a contextual desktop action and mobile bottom bar.
  if (pathname.startsWith("/turlar/")) return null;

  return (
    <a
      href={createSiteWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Mivatur ile WhatsApp'tan iletişime geç"
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex size-13 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_8px_24px_rgb(37_35_41_/_0.16)] outline-none transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-[0_10px_28px_rgb(37_35_41_/_0.2)] focus-visible:ring-3 focus-visible:ring-[#25d366]/35 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:right-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:size-14"
    >
      <WhatsAppIcon />
    </a>
  );
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" className="size-6 lg:size-7" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.47 0 .12 5.35.12 11.93c0 2.1.55 4.16 1.6 5.97L.02 24l6.24-1.64a11.9 11.9 0 0 0 5.78 1.48h.01C18.63 23.84 24 18.49 24 11.91c0-3.18-1.24-6.17-3.5-8.41ZM12.05 21.83h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.23-.37a9.89 9.89 0 0 1-1.52-5.3c0-5.46 4.44-9.9 9.9-9.9a9.82 9.82 0 0 1 7 2.9 9.84 9.84 0 0 1 2.9 7c-.01 5.46-4.45 9.9-9.91 9.9Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.31.17-1.43-.07-.12-.27-.2-.57-.35Z" /></svg>;
}
