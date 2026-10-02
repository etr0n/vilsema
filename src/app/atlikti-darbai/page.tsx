import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader, Section } from "@/components/site/layout";
import { Works, WorksFromUrl } from "./works-client";

export const metadata: Metadata = {
  title: "Atlikti darbai",
  description: "Vilsemos sumontuotų durų darbai Kaune.",
  openGraph: {
    title: "Atlikti darbai — Vilsema",
    description: "Nuotraukos iš sumontuotų durų projektų.",
    type: "website",
  },
};

export default function WorksPage() {
  return (
    <>
      <PageHeader
        title="Atlikti darbai"
        intro="Projektai, kuriuos pagaminome ir sumontavome Kaune. Kiekvienas jų prasidėjo nuo matavimo vietoje ir pokalbio, kokios durys tinka būtent jums."
      />
      <Section>
        <Suspense fallback={<Works kategorija={undefined} />}>
          <WorksFromUrl />
        </Suspense>
      </Section>
    </>
  );
}
