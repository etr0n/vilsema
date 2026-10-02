"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectLightbox } from "@/components/site/project-lightbox";
import { projectCategories, projectImage, projects } from "@/lib/site-data";
import { asset } from "@/lib/utils";

const isCategory = (v: unknown): v is (typeof projectCategories)[number] =>
  typeof v === "string" && (projectCategories as readonly string[]).includes(v);

const firstCategory = projectCategories[0];

// Reads ?kategorija= from the URL. Must sit inside <Suspense> for the static export.
export function WorksFromUrl() {
  const raw = useSearchParams().get("kategorija");
  return <Works kategorija={isCategory(raw) ? raw : undefined} />;
}

export function Works({ kategorija }: { kategorija: string | undefined }) {
  const tab = kategorija ?? firstCategory;
  const [active, setActive] = useState<number | null>(null);
  const items = projects.filter((p) => p.category === tab);

  // Update the URL in place (no page reload, no scroll jump); Next keeps useSearchParams in sync.
  const selectTab = (c: string) => {
    const url =
      c === firstCategory
        ? window.location.pathname
        : `${window.location.pathname}?kategorija=${encodeURIComponent(c)}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <>
      <div className="mb-14 flex flex-wrap gap-2.5" role="tablist" aria-label="Darbų kategorijos">
        {projectCategories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={tab === c}
            onClick={() => selectTab(c)}
            className={`rounded-full bg-pill px-6 py-3 text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-pill-hover ${
              tab === c
                ? "text-foreground ring-1 ring-foreground/25"
                : "text-foreground/55 hover:text-foreground/75"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {items.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <figure key={p.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Peržiūrėti: ${p.caption}`}
                className="group block aspect-[3/4] w-full overflow-hidden bg-muted"
              >
                <img
                  src={asset(projectImage(p, "sm"))}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </button>
            </figure>
          ))}
        </div>
      ) : (
        <p className="max-w-md text-sm font-light leading-6 text-foreground/50">
          Šios kategorijos darbų nuotraukos dar ruošiamos.
        </p>
      )}

      <ProjectLightbox
        projects={items}
        index={active}
        onIndexChange={setActive}
        onClose={() => setActive(null)}
      />
    </>
  );
}
