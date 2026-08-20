import type { Metadata } from "next";

import { TourListingPage } from "@/components/tours/tour-listing-page";
import { getPublishedInternationalTours } from "@/lib/db/repositories/public-tours";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Yurtdışı Turları",
  description: "Mivatur ile öne çıkan yurtdışı tur programlarını keşfedin.",
  alternates: { canonical: "/yurtdisi-turlari" },
};

export default async function InternationalToursPage() {
  return (
    <TourListingPage
      title="Yurtdışı Turları"
      description="Farklı kültürlere ve unutulmaz rotalara uzanan yurtdışı turlarını keşfedin."
      tours={await getPublishedInternationalTours()}
      showTypeFilter={false}
    />
  );
}
