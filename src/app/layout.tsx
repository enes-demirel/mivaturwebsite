import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mivatur.com"),
  title: {
    default: "Mivatur | Dünyayı Keşfet",
    template: "%s | Mivatur",
  },
  description:
    "Mivatur ile özenle hazırlanan yurt içi ve yurt dışı turlarını keşfedin.",
  applicationName: "Mivatur",
  keywords: ["Mivatur", "tur", "seyahat", "yurt dışı turları", "yurt içi turları"],
  authors: [{ name: "Mivatur" }],
  creator: "Mivatur",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Mivatur",
    title: "Mivatur | Dünyayı Keşfet",
    description:
      "Özenle hazırlanan yurt içi ve yurt dışı turlarıyla yeni rotalar keşfedin.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mivatur | Dünyayı Keşfet",
    description:
      "Özenle hazırlanan yurt içi ve yurt dışı turlarıyla yeni rotalar keşfedin.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
