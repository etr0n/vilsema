import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DoorFinishViewer } from "@/components/site/door-finish-viewer";
import { EnquireButton } from "@/components/site/layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { interiorDoors } from "@/lib/site-data";

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
      <Link href="/vidaus-durys" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Vidaus durys
      </Link>
      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <p className="text-sm uppercase tracking-[0.14em] text-foreground/75">{door.category}</p>
          <h1 className="mt-4 text-2xl font-normal uppercase tracking-tight sm:text-3xl">{door.name}</h1>

          <EnquireButton model={door.name} className="mt-10 w-full">
            Gauti pasiūlymą
          </EnquireButton>

          <Accordion type="multiple" className="mt-12 border-t border-foreground/20">
            {[
              ["Apie produktą", <p key="a">{door.description}</p>],
              [
                "Tech. specifikacijos",
                <div key="t" className="grid gap-3">
                  <p>
                    <span className="text-foreground">Spalvos.</span> Galima rinktis iš RAL paletės spalvų ir lengvai
                    priderinti duris prie interjero.
                  </p>
                  <p>
                    <span className="text-foreground">Apdaila.</span> Atrinktos medžio tekstūros ir spalvos leidžia
                    sukurti natūralų, išbaigtą durų charakterį.
                  </p>
                </div>,
              ],
              ["Matmenys", <p key="m">Gaminama pagal individualius matmenis, kad durys tiksliai atitiktų jūsų erdvę.</p>],
              [
                "Kaina",
                <p key="k">
                  Kaina priklauso nuo matmenų, apdailos ir komplektacijos. Gavę jūsų užklausą, parengsime individualų
                  pasiūlymą.
                </p>,
              ],
            ].map(([title, body], i) => (
              <AccordionItem key={i} value={`s${i}`} className="border-foreground/20">
                <AccordionTrigger className="gap-6 py-7 text-left text-2xl font-normal hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground [&>svg]:size-5 [&>svg]:text-foreground">{title}</AccordionTrigger>
                <AccordionContent className="pb-7 text-2xl font-normal leading-snug text-foreground">{body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="order-first lg:col-span-6">
          <DoorFinishViewer
            alt={door.alt}
            finishes={[
              { label: "Dažyta", src: door.imageLarge ?? door.image ?? "" },
              ...(door.veneerImage ? [{ label: "Faneruota", src: door.veneerImage }] : []),
            ]}
          />
        </div>
      </div>
    </article>
  );
}
