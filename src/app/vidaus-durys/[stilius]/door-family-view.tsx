"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EnquireButton } from "@/components/site/layout";
import type { DoorFamily } from "@/lib/site-data";
import { asset } from "@/lib/utils";

type Props = { family: DoorFamily; children: React.ReactNode };

// Reads ?rastas= from the URL. Must sit inside <Suspense> for the static export.
export function DoorFamilyFromUrl(props: Props) {
  const raw = Number(useSearchParams().get("rastas"));
  const initial = props.family.patterns.some((p) => p.number === raw) ? raw : undefined;
  return <DoorFamilyView {...props} initialPattern={initial} />;
}

export function DoorFamilyView({
  family,
  initialPattern,
  children,
}: Props & { initialPattern?: number | undefined }) {
  const [number, setNumber] = useState(initialPattern ?? family.patterns[0]?.number);
  const [veneer, setVeneer] = useState(false);
  const pattern = family.patterns.find((p) => p.number === number) ?? family.patterns[0];
  if (!pattern) return null;

  // A pattern without a veneer photo is only shown painted.
  const showVeneer = veneer && !!pattern.veneerImage;
  const finishes = [
    { label: "Dažyta", src: pattern.imageLarge, active: !showVeneer, select: () => setVeneer(false) },
    ...(pattern.veneerImage
      ? [{ label: "Faneruota", src: pattern.veneerImage, active: showVeneer, select: () => setVeneer(true) }]
      : []),
  ];

  const selectPattern = (n: number) => {
    setNumber(n);
    window.history.replaceState(null, "", `${window.location.pathname}?rastas=${n}`);
  };

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-6">
      <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
        <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">{family.title}</h1>
        <p className="mt-3 text-lg text-ink-2">
          Raštas {pattern.number} · {showVeneer ? "Faneruota" : "Dažyta"}
        </p>

        <div className="mt-10 grid grid-cols-5 gap-2 sm:grid-cols-6" role="group" aria-label="Raštas">
          {family.patterns.map((p) => (
            <button
              key={p.number}
              type="button"
              aria-pressed={p.number === pattern.number}
              aria-label={`Raštas ${p.number}`}
              onClick={() => selectPattern(p.number)}
              className={`overflow-hidden border bg-card transition-colors ${
                p.number === pattern.number ? "border-foreground" : "border-transparent hover:border-foreground/30"
              }`}
            >
              <img src={asset(p.image)} alt="" loading="lazy" className="aspect-[2/3] w-full scale-[1.6] object-cover" />
            </button>
          ))}
        </div>

        <EnquireButton
          model={`${family.title} — raštas ${pattern.number}${showVeneer ? ", faneruota" : ""}`}
          className="mt-10 w-full"
        >
          Gauti pasiūlymą
        </EnquireButton>

        {children}
      </div>

      <div className="order-first lg:col-span-6">
        <div className="aspect-[3/4] overflow-hidden bg-card">
          <img
            src={asset(showVeneer && pattern.veneerImage ? pattern.veneerImage : pattern.imageLarge)}
            alt={`${family.title}, raštas ${pattern.number}`}
            className="h-full w-full object-cover"
          />
        </div>
        {finishes.length > 1 && (
          <div className="mt-3 flex gap-3" role="group" aria-label="Apdaila">
            {finishes.map((f) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={f.active}
                onClick={f.select}
                className={`w-24 border bg-card p-1 transition-colors ${
                  f.active ? "border-foreground" : "border-transparent hover:border-foreground/30"
                }`}
              >
                <img src={asset(f.src)} alt="" className="aspect-[3/4] w-full object-cover" />
                <span className="mt-1 block text-center text-xs text-ink-2">{f.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
