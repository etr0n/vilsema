"use client";

import type { ReactNode } from "react";
import { StripArrows, useStripScroll } from "@/components/site/strip-scroll";

// Four across on desktop for tall door pictures.
export const showcaseCellQuarter = "w-[72vw] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]";
// Three across on desktop, two on tablet, as in Kastrup's "Stilarter" row.
export const showcaseCellThird = "w-[72vw] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";

// Title and intro on the grid, then a row that scrolls out to both screen edges.
export function ShowcaseRow({
  title,
  intro,
  cta,
  listLabel,
  prevLabel,
  nextLabel,
  children,
}: {
  title: string;
  intro?: ReactNode;
  // Link shown next to the arrows, as Kastrup's "Se alle".
  cta?: ReactNode;
  listLabel: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
}) {
  const { ref, status, nudge } = useStripScroll<HTMLUListElement>("li");

  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{title}</h2>
          <div className="flex items-center gap-6">
            {cta}
            <StripArrows status={status} nudge={nudge} prevLabel={prevLabel} nextLabel={nextLabel} />
          </div>
        </div>
        {intro && <p className="mt-4 max-w-2xl text-xl leading-[30px] text-foreground text-pretty">{intro}</p>}
      </div>

      <ul
        ref={ref}
        aria-label={listLabel}
        className="no-scrollbar mx-[calc(50%-50vw)] flex snap-x snap-mandatory gap-6 overflow-x-auto px-[calc(50vw-50%)]"
      >
        {children}
      </ul>
    </div>
  );
}
