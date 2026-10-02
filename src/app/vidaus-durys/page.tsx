import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/site/layout";
import { Doors, DoorsFromUrl } from "./doors-client";

export const metadata: Metadata = {
  title: "Vidaus durys",
  description: "Vidaus durų pasirinkimas: klasikinės, modernios ir elegantiškos.",
  openGraph: {
    title: "Vidaus durys — Vilsema",
    description: "Vidaus durys, gaminamos pagal individualius matmenis.",
    type: "website",
  },
};

export default function InteriorDoors() {
  return (
    <>
      <PageHeader title="Vidaus durys" intro="Durys gaminamos pagal individualius matmenis." />
      <Section>
        {/* The fallback (all doors) is what the static HTML contains; the URL filter applies on load. */}
        <Suspense fallback={<Doors kategorija={undefined} />}>
          <DoorsFromUrl />
        </Suspense>
      </Section>
    </>
  );
}
