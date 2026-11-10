import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";
import { photos } from "@/lib/site-data";
import { asset } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Apie mus",
  description: "Nedidelė durų įmonė Kaune: konsultacija, matavimas ir montavimas.",
  openGraph: {
    title: "Apie mus — Vilsema",
    description: "Vilsemos komanda ir paslaugos Kaune.",
    type: "website",
  },
};

const people = [
  {
    name: "Vardenis Pavardenis",
    role: "Įkūrėjas",
    photo: null as string | null,
  },
  {
    name: "Vardenis Pavardenis",
    role: "Įkūrėjas",
    photo: null as string | null,
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="Apie mus"
        intro="Vilsema - nedidelė durų įmonė Kaune. Padedame išsirinkti vidaus ir lauko duris, atvykstame išmatuoti ir sumontuojame."
        brand
        overlap={false}
      />
      <Section className="pt-28 sm:pt-40">
        <div className="grid gap-16 md:gap-28">
          {people.map((p, i) => {
            // Every second person is mirrored on desktop: text left, photo right.
            const mirrored = i % 2 === 1;
            return (
              <div key={i} className="grid items-start gap-y-10 md:grid-cols-12 md:gap-x-6">
                <img
                  src={asset(p.photo ?? photos.interior)}
                  alt={p.photo ? p.name : ""}
                  className={`aspect-[4/5] w-full bg-muted object-cover md:col-span-5 ${
                    mirrored ? "md:col-start-8 md:row-start-1" : ""
                  }`}
                  loading="lazy"
                />
                <div
                  className={`md:col-span-5 md:pt-20 ${
                    mirrored ? "md:col-start-3 md:row-start-1 md:pr-10 md:text-right" : "md:col-start-6 md:pl-10"
                  }`}
                >
                  <h2 className="text-2xl font-normal">{p.name}</h2>
                  <p className="mt-1 text-xl leading-[30px]">{p.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
