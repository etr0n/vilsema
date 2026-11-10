"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonBase } from "@/components/site/button-styles";
import { useEnquiry } from "@/components/site/enquiry";
import type { DoorPattern } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { patternHref } from "../../door-details";

const arrowClass =
  "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-foreground";

const thumbCount = 5;

// One door: the large picture with its raštai underneath; name, finish switch, enquiry and details on the right.
export function ProductView({
  title,
  intro,
  slug,
  pattern,
  patterns,
  prevHref,
  nextHref,
  children,
}: {
  title: string;
  intro: string;
  slug: string;
  pattern: DoorPattern;
  patterns: DoorPattern[];
  prevHref: string;
  nextHref: string;
  children: ReactNode;
}) {
  const { open } = useEnquiry();
  const [veneer, setVeneer] = useState(false);
  const showVeneer = veneer && !!pattern.veneerImage;
  const model = `${title} — raštas ${pattern.number}${showVeneer ? ", faneruota" : ""}`;

  // A window of thumbnails that always holds the current raštas; end tiles show how many more are hidden.
  const index = patterns.findIndex((p) => p.number === pattern.number);
  const start = Math.min(Math.max(index - Math.floor(thumbCount / 2), 0), Math.max(patterns.length - thumbCount, 0));
  const visible = patterns.slice(start, start + thumbCount);
  const hiddenBefore = start;
  const hiddenAfter = patterns.length - start - visible.length;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-6">
        <div className="relative">
          <img
            key={`${pattern.number}-${showVeneer ? "veneer" : "painted"}`}
            src={asset(showVeneer && pattern.veneerImage ? pattern.veneerImage : pattern.imageLarge)}
            alt={model}
            className="aspect-3/4 w-full object-contain lg:max-h-[calc(100svh-12rem)]"
          />
          <Link href={prevHref} replace scroll={false} aria-label="Ankstesnis raštas" className={`${arrowClass} left-0`}>
            <ChevronLeft className="size-6" strokeWidth={2.25} />
          </Link>
          <Link href={nextHref} replace scroll={false} aria-label="Kitas raštas" className={`${arrowClass} right-0`}>
            <ChevronRight className="size-6" strokeWidth={2.25} />
          </Link>
        </div>

        <ul className="mt-3 grid grid-cols-5 gap-3" aria-label={`${title}: raštai`}>
          {visible.map((p, i) => {
            const current = p.number === pattern.number;
            const more =
              i === 0 && hiddenBefore > 0 ? hiddenBefore : i === visible.length - 1 && hiddenAfter > 0 ? hiddenAfter : 0;
            return (
              <li key={p.number}>
                <Link
                  href={patternHref(slug, p.number)}
                  replace
                  scroll={false}
                  aria-label={more ? `Raštas ${p.number}, daugiau raštų: ${more}` : `Raštas ${p.number}`}
                  aria-current={current ? "page" : undefined}
                  className={`relative block border bg-stage transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                    current ? "border-foreground/25" : "border-transparent hover:border-foreground/10"
                  }`}
                >
                  <img src={asset(p.image)} alt="" loading="lazy" className="aspect-3/4 w-full object-contain" />
                  {more > 0 && !current && (
                    <span aria-hidden className="absolute inset-0 bg-white/70" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
        <h1 className="text-3xl font-normal leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-xl text-foreground">Raštas {pattern.number}</p>

        <p className="mt-8 text-xl leading-[30px] text-foreground text-pretty">{intro}</p>

        {pattern.veneerImage && (
          <div className="mt-8 flex gap-6 text-xl" role="group" aria-label="Apdaila">
            {(
              [
                ["Dažyta", false],
                ["Faneruota", true],
              ] as const
            ).map(([label, value]) => (
              <button
                key={label}
                type="button"
                aria-pressed={showVeneer === value}
                onClick={() => setVeneer(value)}
                className={`cursor-pointer underline-offset-[6px] transition-colors ${
                  showVeneer === value ? "text-foreground underline decoration-1" : "text-ink-2 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => open(model)}
          className={`${buttonBase} mt-10 w-full cursor-pointer text-sm tracking-[0.14em]`}
        >
          Gauti pasiūlymą
        </button>

        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}
