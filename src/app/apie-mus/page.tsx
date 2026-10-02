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
            <div key={p.name}>
              {p.photo ? (
                <img
                  src={asset(p.photo)}
                  alt={p.name}
                  className="aspect-[4/5] w-full max-w-md object-cover"
                  loading="lazy"
                />
              ) : null}
              <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-foreground/40">{p.role}</p>
              <h2 className="mt-3 text-lg font-light">{p.name}</h2>
              <p className="mt-3 max-w-md text-sm font-light leading-6 text-foreground/50">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
