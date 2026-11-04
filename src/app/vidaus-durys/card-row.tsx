"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/utils";

export type CardRowItem = {
  key: string;
  title: string;
  text: string;
  image: string;
  alt?: string;
  href?: string;
  // "contain" for product renders on white, "cover" for room photos.
  fit?: "contain" | "cover";
};

// A titled row of cards that scrolls sideways inside the page margins, with arrows by the title.
export function CardRow({ title, items }: { title: string; items: CardRowItem[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    const first = el?.querySelector("li");
    if (!el || !first) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (first.getBoundingClientRect().width + 24), behavior: reduced ? "auto" : "smooth" });
  };

  const arrow =
    "flex size-10 cursor-pointer items-center justify-center transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-foreground";
  const scrollable = !(edges.start && edges.end);

  return (
    <div className="min-w-0">
      <div className="mb-10 flex items-center justify-between gap-6">
        <h3 className="text-2xl font-normal sm:text-3xl">{title}</h3>
        {scrollable && (
          <div className="-mr-2 flex gap-2">
            <button type="button" aria-label="Ankstesni" disabled={edges.start} onClick={() => nudge(-1)} className={arrow}>
              <ChevronLeft className="size-7 stroke-[1.5]" />
            </button>
            <button type="button" aria-label="Tolesni" disabled={edges.end} onClick={() => nudge(1)} className={arrow}>
              <ChevronRight className="size-7 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>

      <ul ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto">
        {items.map((item) => {
          const image = (
            <img
              src={asset(item.image)}
              alt={item.alt ?? ""}
              loading="lazy"
              className={`aspect-4/3 w-full ${
                item.fit === "cover" ? "object-cover" : "bg-white object-contain p-6"
              }`}
            />
          );
          return (
            <li key={item.key} className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
              {item.href ? (
                <Link href={item.href} tabIndex={-1} aria-hidden className="block">
                  {image}
                </Link>
              ) : (
                image
              )}
              <p className="mt-8 text-xl font-normal sm:text-2xl">
                {item.href ? (
                  <Link href={item.href} className="transition-colors hover:text-link-hover">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </p>
              <p className="mt-4 text-lg leading-7 text-ink-2 text-pretty">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
