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
    role: "Įkūrėjas ir savininkas",
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
              <div className="md:col-span-5 md:col-start-7">
                <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/65">{p.role}</p>
                <h2 className="mt-3 text-lg font-light">{p.name}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-foreground/75">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
