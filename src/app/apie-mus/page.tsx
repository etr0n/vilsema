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
    text: "Įmonę įkūrė iš meilės tiksliai atliktam darbui. Pats atvyksta išmatuoti, padeda išsirinkti ir prižiūri kiekvieną montavimą.",
    photo: null as string | null,
  },
];

export default function About() {
  return (
    <>
      <PageHeader
        title="Apie mus"
        intro="Vilsema — nedidelė durų įmonė Kaune. Padedame išsirinkti vidaus ir lauko duris, atvykstame išmatuoti ir sumontuojame."
        brand
      />
      <Section>
        <div className="grid gap-16">
          {people.map((p) => (
            <div key={p.name} className="grid items-start gap-y-10 md:grid-cols-12 md:gap-x-6">
              <img
                src={asset(p.photo ?? photos.interior)}
                alt={p.photo ? p.name : ""}
                className="aspect-[4/5] w-full bg-muted object-cover md:col-span-5"
                loading="lazy"
              />
              {/* On desktop this text sits on the green band beside the photo */}
              <div className="md:col-span-5 md:col-start-7 md:text-header-text">
                <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{p.name}</h2>
                <p className="mt-4 max-w-xl text-xl leading-relaxed text-ink-2 md:text-header-text/75">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
