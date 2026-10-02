import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";
import { CatalogueCard, exteriorCatalogue } from "@/components/site/catalogue-card";
import { photos } from "@/lib/site-data";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lauko durys",
  description: "Lauko durys Kaune: konsultacija, matavimas ir montavimas.",
  openGraph: {
    title: "Lauko durys — Vilsema",
    description: "Lauko durys, pritaikytos jūsų namams.",
    type: "website",
  },
};

export default function ExteriorDoors() {
  return (
    <>
      <PageHeader
        title="Lauko durys"
        intro="Padedame išsirinkti lauko duris, atvykstame išmatuoti ir sumontuojame Kaune."
      />
      <Section>
        <div className="aspect-[4/3] overflow-hidden bg-muted sm:aspect-[16/9]">
          <img src={asset(photos.interior)} alt="Lauko durys" className="h-full w-full object-cover" />
        </div>
        <div className="mt-20">
          <CatalogueCard catalogue={exteriorCatalogue} />
        </div>
      </Section>
    </>
  );
}
