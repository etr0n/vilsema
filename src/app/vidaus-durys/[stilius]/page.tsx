import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { doorFamilies, type DoorFamily } from "@/lib/site-data";
import { DoorFamilyFromUrl, DoorFamilyView } from "./door-family-view";

// One static page per door style is generated at build time.
export function generateStaticParams() {
  return doorFamilies.map((f) => ({ stilius: f.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/vidaus-durys/[stilius]">): Promise<Metadata> {
  const { stilius } = await props.params;
  const family = doorFamilies.find((f) => f.slug === stilius);
  if (!family) return { title: "Nerasta", robots: { index: false } };
  return {
    title: family.title,
    description: family.intro,
    openGraph: { title: `${family.title} — Vilsema`, description: family.intro, type: "website" },
  };
}

function Details({ family }: { family: DoorFamily }) {
  return (
    <Accordion type="multiple" className="mt-12 border-t border-foreground/20">
      {[
        ["Apie produktą", <p key="a">{family.description}</p>],
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
  );
}

export default async function DoorFamilyPage(props: PageProps<"/vidaus-durys/[stilius]">) {
  const { stilius } = await props.params;
  const family = doorFamilies.find((f) => f.slug === stilius);
  if (!family) notFound();

  return (
    <article className="page-container pb-28 pt-32 sm:pb-40 sm:pt-40">
      <Link href="/vidaus-durys" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-link-hover">
        <ArrowLeft className="size-4" aria-hidden />
        Vidaus durys
      </Link>
      {/* The fallback (first pattern) is what the static HTML contains; ?rastas= applies on load. */}
      <Suspense
        fallback={
          <DoorFamilyView family={family}>
            <Details family={family} />
          </DoorFamilyView>
        }
      >
        <DoorFamilyFromUrl family={family}>
          <Details family={family} />
        </DoorFamilyFromUrl>
      </Suspense>
    </article>
  );
}
