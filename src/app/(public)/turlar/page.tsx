import type { Metadata } from "next";

import { TourListingPage } from "@/components/tours/tour-listing-page";
import { demoTours } from "@/data/demo-tours";

export const metadata: Metadata = {
  title: "Tüm Turlar",
  description: "Mivatur yurt içi ve yurt dışı tur seçeneklerini keşfedin.",
  alternates: { canonical: "/turlar" },
};

export default function ToursPage() {
  return (
    <TourListingPage
      title="Tüm Turlar"
      description="Özenle hazırlanan yurt içi ve yurt dışı tur programlarımızı inceleyin."
      tours={demoTours}
    />
  );
}
