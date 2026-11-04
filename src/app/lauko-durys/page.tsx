import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";

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
        overlap={false}
      />
      <Section className="pt-16 sm:pt-20">
        <div id="katalogas" className="scroll-mt-28">
          {/* Placeholder for the PDF catalogue preview, shaped like an A4 page */}
          <div aria-hidden className="aspect-[1/1.414] w-full max-w-xs bg-muted" />
          <h2 className="mt-8 text-2xl font-normal">Lauko durų katalogas</h2>
          <p className="mt-3 max-w-md text-lg leading-7 text-ink-2">
            Peržiūrėkite arba atsisiųskite lauko durų katalogą PDF formatu.
          </p>
        </div>
      </Section>
    </>
  );
}
