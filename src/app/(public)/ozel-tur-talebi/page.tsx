import type { Metadata } from "next";

import { CustomTourRequestForm } from "@/components/custom-tour/custom-tour-request-form";
import { Container } from "@/components/ui/container";

const title = "Özel Tur Talebi | Size Özel Seyahat Planı | Mivatur";
const description = "Mivatur ile size özel tur talebi oluşturun. Tarihlerinizi, katılımcı sayınızı ve görmek istediğiniz destinasyonları paylaşın; seyahatinize özel tur programı hazırlayalım.";

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: "/ozel-tur-talebi" }, robots: { index: true, follow: true }, openGraph: { title, description, type: "website", url: "/ozel-tur-talebi" }, twitter: { card: "summary_large_image", title, description } };

export default function CustomTourRequestPage() { return <div className="bg-background py-10 sm:py-14 lg:py-16"><Container className="max-w-5xl"><header className="max-w-3xl"><p className="text-sm font-extrabold tracking-[0.14em] text-brand uppercase">Size Özel</p><h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-text sm:text-5xl">Özel Tur Talebi Oluşturun</h1><p className="mt-5 text-base leading-7 text-muted sm:text-lg">Tarihlerinizi, katılımcı sayınızı ve görmek istediğiniz destinasyonları bizimle paylaşın. Mivatur ekibi talebinize özel tur programı için sizinle iletişime geçsin.</p></header><div className="mt-9"><CustomTourRequestForm /></div></Container></div>; }
