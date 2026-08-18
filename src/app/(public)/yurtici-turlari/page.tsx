import type { Metadata } from "next";

import { TourListingPage } from "@/components/tours/tour-listing-page";
import { getToursByType } from "@/data/demo-tours";

export const metadata: Metadata = {
  title: "Yurtiçi Turlar",
  description: "Mivatur ile Türkiye'nin öne çıkan rotalarını keşfedin.",
  alternates: { canonical: "/yurtici-turlari" },
};

export default function DomesticToursPage() {
  return (
    <TourListingPage
      title="Yurtiçi Turlar"
      description="Türkiye'nin eşsiz doğasını ve kültürel mirasını keşfedeceğiniz turları inceleyin."
      tours={getToursByType("domestic")}
      showTypeFilter={false}
    />
  );
}
