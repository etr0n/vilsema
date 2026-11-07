"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EnquireButton } from "@/components/site/layout";
import type { DoorPattern } from "@/lib/site-data";
import { asset } from "@/lib/utils";

const arrowClass =
  "flex size-11 items-center justify-center text-black transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-foreground";

// One door: the large picture on the left; name, finish switch, enquiry and details on the right.
export function ProductView({
  title,
  intro,
  pattern,
  prevHref,
  nextHref,
  children,
}: {
  title: string;
  intro: string;
  pattern: DoorPattern;
  prevHref: string;
  nextHref: string;
  children: ReactNode;
}) {
  const [veneer, setVeneer] = useState(false);
  const showVeneer = veneer && !!pattern.veneerImage;
  const model = `${title} — raštas ${pattern.number}${showVeneer ? ", faneruota" : ""}`;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-6">
      <img
        key={showVeneer ? "veneer" : "painted"}
        src={asset(showVeneer && pattern.veneerImage ? pattern.veneerImage : pattern.imageLarge)}
        alt={model}
        className="aspect-3/4 w-full object-contain lg:col-span-6 lg:max-h-[calc(100svh-12rem)]"
      />

      <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-normal leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-2 text-xl text-ink-2">Raštas {pattern.number}</p>
          </div>
          <div className="-mr-2 flex gap-1">
            <Link href={prevHref} aria-label="Ankstesnis raštas" className={arrowClass}>
              <ChevronLeft className="size-9" strokeWidth={2.25} />
            </Link>
            <Link href={nextHref} aria-label="Kitas raštas" className={arrowClass}>
              <ChevronRight className="size-9" strokeWidth={2.25} />
            </Link>
          </div>
        </div>

        <p className="mt-8 text-lg leading-7 text-ink-2 text-pretty">{intro}</p>

        {pattern.veneerImage && (
          <div className="mt-8 flex gap-6 text-lg" role="group" aria-label="Apdaila">
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

        <EnquireButton model={model} className="mt-10 w-full">
          Gauti pasiūlymą
        </EnquireButton>

        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}
