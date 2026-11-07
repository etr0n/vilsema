import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/layout";
import { ProjectStrip } from "@/components/site/project-strip";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { doorConstructions, doorFamilies, paintColors, projects } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { ShowcaseRow, showcaseCellThird } from "./showcase-row";
import { StyleSection } from "./style-section";

export const metadata: Metadata = {
  title: "Vidaus durys",
  description: "Vidaus durų pasirinkimas: klasikinės, modernios ir elegantiškos.",
  openGraph: {
    title: "Vidaus durys — Vilsema",
    description: "Vidaus durys, gaminamos pagal individualius matmenis.",
    type: "website",
  },
};

// Official RAL Classic chart, so visitors can browse every colour.
const ralChartUrl = "https://www.ral-farben.de/en/all-ral-colours";

const linkClass =
  "inline-block text-xl font-normal transition-colors hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground";

export default function InteriorDoors() {
  return (
    <>
      <PageHeader
        title="Vidaus durys"
        intro="Klasikinės, modernios ir elegantiškos durys pagal jūsų matmenis."
        brand
        overlap={false}
      />

      <div className="page-container flex flex-col gap-28 py-28 sm:gap-40 sm:py-40">
        {doorFamilies.map((f) => (
          <ScrollReveal key={f.slug}>
            <StyleSection family={f} />
          </ScrollReveal>
        ))}
      </div>

      <section id="duru-tipai" className="page-container scroll-mt-24 pb-28 sm:pb-40">
        <ScrollReveal>
          <ShowcaseRow
            title="Durų tipai"
            listLabel="Durų tipai"
            prevLabel="Ankstesni durų tipai"
            nextLabel="Tolesni durų tipai"
          >
            {doorConstructions.map((c) => (
              <li key={c.slug} className={showcaseCellThird}>
                <img
                  src={asset(c.image3d)}
                  alt={`${c.name}: durų ir staktos vaizdas`}
                  loading="lazy"
                  className="aspect-[363/192] w-full object-contain"
                />
                <h3 className="mt-8 text-2xl font-normal">{c.name}</h3>
                <p className="mt-4 text-xl leading-[30px] text-foreground text-pretty">{c.text}</p>
              </li>
            ))}
          </ShowcaseRow>
        </ScrollReveal>
      </section>

      <section id="spalvos" className="page-container scroll-mt-24 pb-28 sm:pb-40">
        <ScrollReveal>
          <ShowcaseRow
            title="Spalvos"
            intro="Galima rinktis bet kurią RAL paletės spalvą."
            cta={
              <a href={ralChartUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <span className="underline decoration-1 underline-offset-[6px]">Visos spalvos</span>
              </a>
            }
            listLabel="Spalvos"
            prevLabel="Ankstesnės spalvos"
            nextLabel="Tolesnės spalvos"
          >
            {paintColors.map((c) => (
              <li key={c.code} className={showcaseCellThird}>
                <div
                  role="img"
                  aria-label={`${c.code} ${c.name}`}
                  className="aspect-[363/192] w-full"
                  style={{ backgroundColor: c.hex }}
                />
                <h3 className="mt-8 text-2xl font-normal">
                  {c.code} {c.name}
                </h3>
                <p className="mt-4 text-xl leading-[30px] text-foreground">Dažyta</p>
              </li>
            ))}
          </ShowcaseRow>
        </ScrollReveal>
      </section>

      <section id="darbai" className="scroll-mt-24 bg-stone py-28 sm:py-40">
        <ScrollReveal className="page-container">
          <ProjectStrip
            title="Atlikti darbai"
            projects={projects.filter((p) => p.category === "Vidaus durys")}
            editorial
            cta={
              <Link href="/atlikti-darbai" className={linkClass}>
                <span className="underline decoration-1 underline-offset-[6px]">Visi darbai</span>
              </Link>
            }
          />
        </ScrollReveal>
      </section>
    </>
  );
}
