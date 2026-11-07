
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
    <>
      {c.cover ? (
        <img
          src={asset(c.cover)}
          alt={`${c.title} — viršelis`}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="aspect-square w-full bg-muted" />
      )}
      <h2 className="mt-4 text-lg font-normal text-ink-2">{c.title}</h2>
    </>
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
