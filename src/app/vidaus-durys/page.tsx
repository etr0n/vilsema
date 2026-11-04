import type { Metadata } from "next";
import Link from "next/link";
import { EnquireButton, Section } from "@/components/site/layout";
import { ProjectStrip } from "@/components/site/project-strip";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { doorConstructions, doorFamilies, patternCount, photos, projects } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { CardRow } from "./card-row";

export const metadata: Metadata = {
  title: "Vidaus durys",
  description: "Vidaus durų pasirinkimas: klasikinės, modernios ir elegantiškos.",
  openGraph: {
    title: "Vidaus durys — Vilsema",
    description: "Vidaus durys, gaminamos pagal individualius matmenis.",
    type: "website",
  },
};

const lineHref = (slug: string) => `/vidaus-durys/${slug}`;

const sections = [
  { id: "savybes", label: "Savybės" },
  { id: "dizainas", label: "Dizainas" },
  { id: "darbai", label: "Atlikti darbai" },
  { id: "pasiulymas", label: "Pasiūlymas" },
];

const features = [
  ["Pagal jūsų matmenis", "Durys gaminamos pagal angos matmenis – net jei ji nestandartinė ar siekia lubas."],
  ["Spalva ir apdaila", "Bet kuri RAL paletės spalva, dažytas arba faneruotas paviršius."],
  ["Matavimas ir montavimas", "Atvykstame išmatuoti, patariame ir sumontuojame duris Kaune."],
];

const linkClass =
  "inline-block text-xl font-normal transition-colors hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

export default function InteriorDoors() {
  const featureImage = doorFamilies[1]?.patterns[0]?.imageLarge;

  return (
    <>
      {/* Photo behind the whole hero, fading to the page colour at the bottom, as on Kastrup's product pages */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-20">
        <img
          src={asset(photos.interiorDoorsHero)}
          alt=""
          fetchPriority="high"
          className="absolute inset-y-0 left-[8%] h-full w-[84%] object-cover object-[50%_68%] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-background from-20% via-background/75 via-50% to-transparent"
        />

        <div className="page-container relative grid gap-12 pb-10 pt-40 lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="lg:col-span-6">
            <h1 className="text-[clamp(2.441rem,2.441rem+2.1111vw,4.5rem)] font-light leading-[1.05] text-balance">
              Vidaus durys pagal jūsų matmenis
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-7.5">
              Gaminame klasikines, modernias ir elegantiškas vidaus duris pagal individualius matmenis. Padedame
              išsirinkti, atvykstame išmatuoti ir sumontuojame Kaune.
            </p>
          </div>

          <ul className="grid grid-cols-3 gap-4 lg:col-span-5 lg:col-start-8">
            {doorFamilies.map((f) => (
              <li key={f.slug}>
                <Link href={lineHref(f.slug)} className="group block">
                  <span className="block overflow-hidden border border-transparent bg-white transition-colors group-hover:border-foreground">
                    {f.patterns[0] && (
                      <img src={asset(f.patterns[0].image)} alt="" className="aspect-square w-full scale-[1.7] object-cover" />
                    )}
                  </span>
                  <span className="mt-3 block text-base">{f.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Puslapio skyriai" className="page-container relative pb-6">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={linkClass}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="savybes" className="page-container scroll-mt-24 py-28 sm:py-40">
        <ScrollReveal className="grid items-center gap-16 lg:grid-cols-12 lg:gap-x-6">
          {featureImage && (
            <img
              src={asset(featureImage)}
              alt="Modernios vidaus durys"
              loading="lazy"
              className="aspect-4/5 w-full bg-white object-contain p-10 lg:col-span-5"
            />
          )}
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">Vilsema vidaus durys</h2>
            <ol className="mt-12 grid gap-10">
              {features.map(([title, text], i) => (
                <li key={title} className="grid grid-cols-[2.5rem_1fr]">
                  <span className="pt-1.5 text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-2xl font-normal">{title}</h3>
                    <p className="mt-3 text-lg leading-7 text-ink-2 text-pretty">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ScrollReveal>
      </section>

      <section id="dizainas" className="page-container scroll-mt-24 pb-28 sm:pb-40">
        <ScrollReveal>
          <h2 className="mb-16 text-3xl font-normal tracking-tight sm:text-4xl">Sukurkite savo duris</h2>
          <div className="grid gap-24">
            <CardRow
              title="Linijos"
              items={doorFamilies.map((f) => ({
                key: f.slug,
                title: f.name,
                text: `${f.intro} ${patternCount(f.patterns.length)}.`,
                image: f.roomImage,
                alt: f.title,
                href: lineHref(f.slug),
                fit: "cover" as const,
              }))}
            />
            <CardRow
              title="Konstrukcija"
              items={doorConstructions.map((c) => ({
                key: c.slug,
                title: c.name,
                text: c.text,
                image: c.image3d,
                alt: `${c.name}: durų ir staktos vaizdas`,
              }))}
            />
          </div>
        </ScrollReveal>
      </section>

      <section id="darbai" className="page-container scroll-mt-24 pb-28 sm:pb-40">
        <ScrollReveal>
          <ProjectStrip
            title="Atlikti darbai"
            projects={projects.filter((p) => p.category === "Vidaus durys")}
            cta={
              <Link href="/atlikti-darbai" className={linkClass}>
                <span className="underline decoration-1 underline-offset-[6px]">Visi darbai</span>
              </Link>
            }
          />
        </ScrollReveal>
      </section>

      <Section>
        <div id="pasiulymas" className="scroll-mt-32 lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h2 className="mb-8 text-3xl font-normal tracking-tight sm:text-4xl lg:col-span-4 lg:mb-0">
            Gaukite pasiūlymą
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <p className="max-w-xl text-xl leading-relaxed">
              Parašykite, kokių durų ieškote, ir parengsime individualų pasiūlymą.
            </p>
            <EnquireButton className="mt-10">Gauti pasiūlymą</EnquireButton>
          </div>
        </div>
      </Section>
    </>
  );
}
