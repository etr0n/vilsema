import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";
import { CatalogueCard, catalogues } from "@/components/site/catalogue-card";

export const metadata: Metadata = {
  title: "Katalogai",
  description: "Vidaus ir lauko durų katalogai PDF formatu.",
  openGraph: {
    title: "Katalogai — Vilsema",
    description: "Vidaus ir lauko durų katalogai.",
    type: "website",
  },
};

export default function Catalogues() {
  return (
    <>
      <PageHeader title="Katalogai" intro="Durų katalogai PDF formatu." />
      <Section>
        <div className="flex flex-col gap-12">
          {catalogues.map((c) => (
            <CatalogueCard key={c.id} catalogue={c} />
          ))}
        </div>
      </Section>
    </>
  );
}
