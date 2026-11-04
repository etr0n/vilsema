
import { asset } from "@/lib/utils";

export type Catalogue = {
  id: string;
  title: string;
  description: string;
  pdfUrl: string | null;
  cover: string | null;
};

export const interiorCatalogue: Catalogue = {
  id: "vidaus-durys",
  title: "Vidaus durų katalogas",
  description: "Klasikinių, modernių ir elegantiškų vidaus durų modeliai.",
  pdfUrl: null,
  cover: null,
};

export const exteriorCatalogue: Catalogue = {
  id: "lauko-durys",
  title: "Lauko durų katalogas",
  description: "Lauko durų modeliai jūsų namams.",
  pdfUrl: null,
  cover: null,
};

export const catalogues: Catalogue[] = [interiorCatalogue, exteriorCatalogue];

export function CatalogueCard({ catalogue: c }: { catalogue: Catalogue }) {
  const body = (
    <div className="grid min-h-[300px] bg-ink-2 text-hero-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-12 sm:py-20 lg:px-16">
        <h2 className="text-2xl font-normal">{c.title}</h2>
        <p className="mt-4 max-w-md text-xl font-normal leading-relaxed text-hero-foreground/75">
          {c.description}
        </p>
      </div>
      {c.cover ? (
        <img
          src={asset(c.cover)}
          alt={`${c.title} — viršelis`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="min-h-[180px] bg-card" />
      )}
    </div>
  );

  return c.pdfUrl ? (
    <a
      id={c.id}
      href={asset(c.pdfUrl)}
      download
      className="block scroll-mt-28 transition-opacity hover:opacity-90"
    >
      {body}
    </a>
  ) : (
    <div id={c.id} className="scroll-mt-28">
      {body}
    </div>
  );
}
