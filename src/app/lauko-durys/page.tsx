import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";
import { CatalogueCard, exteriorCatalogue } from "@/components/site/catalogue-card";

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
        brand
        overlap={false}
      />
      <Section className="pt-28 sm:pt-40">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <CatalogueCard catalogue={exteriorCatalogue} />
        </div>
      </Section>
    </>
  );
}
