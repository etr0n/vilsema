"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ProjectLightbox } from "@/components/site/project-lightbox";
import { projectImage, type Project } from "@/lib/site-data";
import { asset } from "@/lib/utils";

type Status = {
  scrollable: boolean;
  atStart: boolean;
  atEnd: boolean;
  left: number;
  width: number;
};

const EMPTY: Status = {
  scrollable: false,
  atStart: true,
  atEnd: false,
  left: 0,
  width: 100,
};

const same = (a: Status, b: Status) =>
  a.scrollable === b.scrollable &&
  a.atStart === b.atStart &&
  a.atEnd === b.atEnd &&
  Math.abs(a.left - b.left) < 0.2 &&
  Math.abs(a.width - b.width) < 0.2;

export function ProjectStrip({
  title,
  projects,
  cta,
}: {
  title: string;
  projects: Project[];
  cta?: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>(EMPTY);
  const [active, setActive] = useState<number | null>(null);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const scrollable = max > 4;

    const width = el.scrollWidth > 0 ? Math.min(100, (el.clientWidth / el.scrollWidth) * 100) : 100;
    const progress = max > 0 ? Math.min(Math.max(el.scrollLeft / max, 0), 1) : 0;

    const next: Status = {
      scrollable,
      atStart: el.scrollLeft <= 2,
      atEnd: scrollable ? el.scrollLeft >= max - 2 : true,
      width,
      left: progress * (100 - width),
    };

    setStatus((prev) => (same(prev, next) ? prev : next));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(() => measure());
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = el.querySelector<HTMLElement>("figure");
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  const arrow =
    "absolute z-10 flex size-11 items-center justify-center bg-strip-arrow text-strip-arrow-text transition-opacity hover:opacity-85";

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
        <h2 className="text-3xl font-normal tracking-tight sm:text-4xl">{title}</h2>
        {cta}
      </div>

      <div className="relative">
        {status.scrollable && !status.atStart && (
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Ankstesnis darbas"
            className={`${arrow} -left-5 top-[calc(50%-20px)] -translate-y-1/2`}
          >
            <ArrowLeft className="size-4" />
          </button>
        )}
        {status.scrollable && !status.atEnd && (
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Tolesnis darbas"
            className={`${arrow} -right-5 top-[calc(50%-20px)] -translate-y-1/2`}
          >
            <ArrowRight className="size-4" />
          </button>
        )}

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
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 outline-none focus-visible:underline focus-visible:decoration-foreground/30 focus-visible:underline-offset-8 sm:gap-6"
        >
          {projects.map((p, i) => (
            <figure
              key={p.id}
              className="w-[62vw] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100%-3rem)/3)]"
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
                <span className="block text-xl font-normal leading-relaxed text-foreground">
                  {p.caption}
                </span>
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
