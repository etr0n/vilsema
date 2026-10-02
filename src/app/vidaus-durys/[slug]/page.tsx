import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquireButton } from "@/components/site/layout";
import { interiorDoors } from "@/lib/site-data";
import { asset } from "@/lib/utils";

// One static page per door model is generated at build time.
export function generateStaticParams() {
  return interiorDoors.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/vidaus-durys/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const door = interiorDoors.find((d) => d.slug === slug);
  if (!door) return { title: "Nerasta", robots: { index: false } };
  return {
    title: door.name,
    description: door.description,
    openGraph: { title: `${door.name} — Vilsema`, description: door.description, type: "website" },
  };
}

export default async function DoorDetail(props: PageProps<"/vidaus-durys/[slug]">) {
  const { slug } = await props.params;
  const door = interiorDoors.find((d) => d.slug === slug);
  if (!door) notFound();

  return (
    <article className="page-container pb-28 pt-32 sm:pb-40 sm:pt-40">
      <Link href="/vidaus-durys" className="text-[11px] uppercase tracking-[0.18em] text-foreground/40 transition-colors hover:text-foreground/70">
        ← Vidaus durys
      </Link>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          {door.image && <img src={asset(door.image)} alt={door.alt} className="h-full w-full object-contain p-6 sm:p-10" />}
        </div>
        <div className="lg:pt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">{door.category}</p>
          <h1 className="mt-4 text-3xl font-light sm:text-4xl">{door.name}</h1>
          <p className="mt-6 max-w-md text-base font-light leading-7 text-foreground/50">{door.description}</p>

          <dl className="mt-12 grid gap-8 text-sm leading-6">
            <div className="grid gap-2">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Matmenys</dt>
              <dd className="font-light">Gaminama pagal individualius matmenis.</dd>
            </div>
            <div className="grid gap-2">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Spalvos</dt>
              <dd className="font-light">Galimos RAL paletės spalvos.</dd>
            </div>
            <div className="grid gap-2">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Apdaila</dt>
              <dd className="font-light">Atrinktos medžio tekstūros ir spalvos.</dd>
            </div>
            <div className="grid gap-2">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">Kaina</dt>
              <dd className="font-light">Kainą pateikiame susisiekus.</dd>
            </div>
          </dl>

          <EnquireButton model={door.name} className="mt-12">
            Gauti pasiūlymą
          </EnquireButton>
        </div>
      </div>
    </article>
  );
}
