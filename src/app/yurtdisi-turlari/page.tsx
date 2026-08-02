import type { Metadata } from "next";

import { TourListingPage } from "@/components/tours/tour-listing-page";
import { getToursByType } from "@/data/demo-tours";

export const metadata: Metadata = {
  title: "Yurtdışı Turları",
  description: "Mivatur ile öne çıkan yurtdışı tur programlarını keşfedin.",
  alternates: { canonical: "/yurtdisi-turlari" },
};

export default function InternationalToursPage() {
  return (
    <TourListingPage
      title="Yurtdışı Turları"
      description="Farklı kültürlere ve unutulmaz rotalara uzanan yurtdışı turlarını keşfedin."
      tours={getToursByType("international")}
      showTypeFilter={false}
    />
  );
}
