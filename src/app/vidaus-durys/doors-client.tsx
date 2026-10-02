"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { interiorCategories, interiorDoors } from "@/lib/site-data";
import { asset } from "@/lib/utils";

const isCategory = (v: unknown): v is (typeof interiorCategories)[number] =>
  typeof v === "string" && (interiorCategories as readonly string[]).includes(v);

// Reads ?kategorija= from the URL. Must sit inside <Suspense> for the static export.
export function DoorsFromUrl() {
  const raw = useSearchParams().get("kategorija");
  return <Doors kategorija={isCategory(raw) ? raw : undefined} />;
}

export function Doors({ kategorija }: { kategorija: string | undefined }) {
  // Update the URL in place (no page reload, no scroll jump); Next keeps useSearchParams in sync.
  const setCategory = (c: string | undefined) => {
    const url = c
      ? `${window.location.pathname}?kategorija=${encodeURIComponent(c)}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  };

  const items = interiorDoors.filter((d) => (kategorija ? d.category === kategorija : true));

  const pill = (active: boolean) =>
    `rounded-full bg-pill px-6 py-3 text-[11px] uppercase tracking-[0.16em] transition-colors ${
      active
        ? "text-foreground ring-1 ring-foreground/25"
        : "text-foreground/55 hover:text-foreground/75"
    }`;

  return (
    <>
      <div className="mb-14 flex flex-wrap items-center gap-3">
        {["Visos", ...interiorCategories].map((c) => {
          const active = c === "Visos" ? !kategorija : kategorija === c;
          return (
            <button
              key={c}
              aria-pressed={active}
              onClick={() => setCategory(c === "Visos" ? undefined : c)}
              className={pill(active)}
            >
              {c}
            </button>
          );
        })}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((door) => (
            <Link
              key={door.slug}
              href={`/vidaus-durys/${door.slug}`}
              aria-label={`Vidaus durys — ${door.name}`}
              className="group block"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                {door.image && (
                  <img
                    src={asset(door.image)}
                    alt={door.alt}
                    className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-[1.02] sm:p-8"
                  />
                )}
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                {door.name}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="max-w-md text-sm font-light leading-6 text-foreground/50">
          Šios kategorijos nuotraukos dar ruošiamos. Parašykite užklausą — pasiūlysime tinkamų
          variantų.
        </p>
      )}
    </>
  );
}
