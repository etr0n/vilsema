import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EnquireButton } from "@/components/site/layout";
import { ProjectStrip } from "@/components/site/project-strip";
import { doorFamilies, patternCount, projects } from "@/lib/site-data";
import { DoorDetails } from "../door-details";
import { DoorFamilyView } from "./door-family-view";

// One static page per door style is generated at build time.
export function generateStaticParams() {
  return doorFamilies.map((f) => ({ stilius: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/vidaus-durys/[stilius]">): Promise<Metadata> {
  const { stilius } = await props.params;
  const family = doorFamilies.find((f) => f.slug === stilius);
  if (!family) return { title: "Nerasta", robots: { index: false } };
  return {
    title: family.title,
    description: family.intro,
    openGraph: { title: `${family.title} — Vilsema`, description: family.intro, type: "website" },
  };
}

export default async function DoorFamilyPage(props: PageProps<"/vidaus-durys/[stilius]">) {
  const { stilius } = await props.params;
  const family = doorFamilies.find((f) => f.slug === stilius);
  if (!family) notFound();

  const hasVeneer = family.patterns.some((p) => p.veneerImage);
  const styleProjects = projects.filter((p) => p.style === family.slug);

  return (
    <article className="page-container pb-28 pt-32 sm:pb-40 sm:pt-40">
      <Link href="/vidaus-durys" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-link-hover">
        <ArrowLeft className="size-4" aria-hidden />
        Vidaus durys
      </Link>

      <header className="mb-16 mt-10 grid gap-6 sm:mb-20 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <h1 className="text-[clamp(2.441rem,2.441rem+1.5vw,3.75rem)] font-normal leading-[1.05] lg:col-span-5">
          {family.title}
        </h1>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-xl text-lg leading-7 text-ink-2 text-pretty">{family.intro}</p>
          <p className="mt-2 text-lg text-ink-2">
            {patternCount(family.patterns.length)} · {hasVeneer ? "dažyta arba faneruota" : "dažyta"}
          </p>
        </div>
      </header>

      <DoorFamilyView family={family} />

      {styleProjects.length > 0 && (
        <section className="mt-28 sm:mt-40">
          <ProjectStrip title="Atlikti darbai" projects={styleProjects} />
        </section>
      )}

      <section className="mt-28 sm:mt-40 lg:grid lg:grid-cols-12 lg:gap-x-6">
        <h2 className="mb-8 text-3xl font-normal tracking-tight sm:text-4xl lg:col-span-5 lg:mb-0">Informacija</h2>
        <div className="lg:col-span-6 lg:col-start-7">
          <DoorDetails family={family} />
          <EnquireButton model={family.title} className="mt-12">
            Gauti pasiūlymą
          </EnquireButton>
        </div>
      </section>
    </article>
  );
}
