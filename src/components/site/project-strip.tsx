"use client";

import { useState, type ReactNode } from "react";
import { ProjectLightbox } from "@/components/site/project-lightbox";
import { StripArrows, useStripScroll } from "@/components/site/strip-scroll";
import { projectImage, type Project } from "@/lib/site-data";
import { asset } from "@/lib/utils";

export function ProjectStrip({
  title,
  projects,
  cta,
}: {
  title: string;
  projects: Project[];
  cta?: ReactNode;
}) {
  const { ref: scrollerRef, status, nudge } = useStripScroll<HTMLDivElement>("figure");
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{title}</h2>
        <div className="flex items-center gap-6">
          {cta}
          <StripArrows status={status} nudge={nudge} prevLabel="Ankstesnis darbas" nextLabel="Tolesnis darbas" />
        </div>
      </div>

      <div>
        <div
          ref={scrollerRef}
          tabIndex={0}
          role="group"
          aria-label={`${title} — slinkite horizontaliai`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              nudge(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              nudge(-1);
            }
          }}
          className="no-scrollbar mx-[calc(50%-50vw)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50vw-50%)] pb-2 outline-none focus-visible:underline focus-visible:decoration-foreground/30 focus-visible:underline-offset-8 sm:gap-6"
        >
          {projects.map((p, i) => (
            <figure
              key={p.id}
              className="w-[72vw] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Peržiūrėti: ${p.caption}`}
                className="group block aspect-[3/4] w-full cursor-pointer overflow-hidden bg-muted"
              >
                <img
                  src={asset(projectImage(p, "sm"))}
                  alt={p.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </button>
              <figcaption className="mt-4">
                <span className="block text-xl font-normal leading-[30px] text-foreground">{p.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {status.scrollable && (
        <div aria-hidden className="relative mt-10 h-[2px] overflow-hidden bg-foreground/10">
          <span
            className="absolute inset-y-0 bg-strip-line"
            style={{ left: `${status.left}%`, width: `${status.width}%` }}
          />
        </div>
      )}

      <ProjectLightbox
        projects={projects}
        index={active}
        onIndexChange={setActive}
        onClose={() => setActive(null)}
      />
    </div>
  );
}
