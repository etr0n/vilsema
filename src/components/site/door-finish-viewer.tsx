"use client";

import { useState } from "react";
import { asset } from "@/lib/utils";

type Finish = { label: string; src: string };

export function DoorFinishViewer({ finishes, alt }: { finishes: Finish[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = finishes[active] ?? finishes[0];
  if (!current) return null;

  return (
    <div>
      <div className="aspect-[3/4] overflow-hidden bg-white">
        <img src={asset(current.src)} alt={alt} className="h-full w-full object-cover" />
      </div>
      {finishes.length > 1 && (
        <div className="mt-3 flex gap-3" role="group" aria-label="Apdaila">
          {finishes.map((f, i) => (
            <button
              key={f.src}
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`w-24 border bg-white p-1 transition-colors ${
                i === active ? "border-foreground" : "border-transparent hover:border-foreground/30"
              }`}
            >
              <img src={asset(f.src)} alt="" className="aspect-[3/4] w-full object-cover" />
              <span className="mt-1 block text-center text-xs text-foreground/75">{f.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
