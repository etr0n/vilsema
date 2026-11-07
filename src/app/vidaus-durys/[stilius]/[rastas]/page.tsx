import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { doorFamilies } from "@/lib/site-data";
import { DoorDetails, patternHref } from "../../door-details";
import { ProductView } from "./product-view";

// One static page per door pattern is generated at build time.
export function generateStaticParams() {
  return doorFamilies.flatMap((f) => f.patterns.map((p) => ({ stilius: f.slug, rastas: String(p.number) })));
}

export const dynamicParams = false;

async function find(params: PageProps<"/vidaus-durys/[stilius]/[rastas]">["params"]) {
  const { stilius, rastas } = await params;
  const family = doorFamilies.find((f) => f.slug === stilius);
  const index = family?.patterns.findIndex((p) => String(p.number) === rastas) ?? -1;
  return family && index >= 0 ? { family, index } : null;
}

export async function generateMetadata(props: PageProps<"/vidaus-durys/[stilius]/[rastas]">): Promise<Metadata> {
  const found = await find(props.params);
  if (!found) return { title: "Nerasta", robots: { index: false } };
  const { family, index } = found;
  const title = `${family.title}, raštas ${family.patterns[index]?.number}`;
  return {
    title,
    description: family.intro,
    openGraph: { title: `${title} — Vilsema`, description: family.intro, type: "website" },
  };
}

export default async function DoorPatternPage(props: PageProps<"/vidaus-durys/[stilius]/[rastas]">) {
  const found = await find(props.params);
  if (!found) notFound();
  const { family, index } = found;
  const pattern = family.patterns[index];
  if (!pattern) notFound();

  const count = family.patterns.length;
  const neighbour = (step: number) => family.patterns[(index + step + count) % count] ?? pattern;

  return (
    <article className="pb-28 pt-32 sm:pb-40 sm:pt-40">
      <div className="page-container">
        <ProductView
          title={family.title}
          intro={family.intro}
          slug={family.slug}
          pattern={pattern}
          patterns={family.patterns}
          prevHref={patternHref(family.slug, neighbour(-1).number)}
          nextHref={patternHref(family.slug, neighbour(1).number)}
        >
          <DoorDetails family={family} />
        </ProductView>
      </div>
    </article>
  );
}
