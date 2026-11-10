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
        intro="Kiekvienas projektas prasideda nuo tikslių matavimų ir individualių poreikių aptarimo. Parenkame tinkamą durų dizainą, spalvą, apdailą bei techninius sprendimus, kad rezultatas harmoningai derėtų prie jūsų erdvės. Čia pristatome dalį Kaune įgyvendintų vidaus ir lauko durų projektų, kuriuose svarbiausia – kokybiškos medžiagos, preciziška apdaila ir profesionalus montavimas."
        plain
      />
      <Section>
        <Suspense fallback={<Works kategorija={undefined} />}>
          <WorksFromUrl />
        </Suspense>
      </Section>
    </>
  );
}
