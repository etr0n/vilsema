import Link from "next/link";
import type { DoorFamily, DoorPattern } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { patternHref } from "./door-details";
import { ShowcaseRow, showcaseCellQuarter } from "./showcase-row";

// A door picture that opens its product page; used in every door carousel.
export function PatternCard({ family, pattern }: { family: DoorFamily; pattern: DoorPattern }) {
  return (
    <li className={showcaseCellQuarter}>
      <Link
        href={patternHref(family.slug, pattern.number)}
        aria-label={`${family.title}, raštas ${pattern.number}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <img
          src={asset(pattern.image)}
          alt=""
          loading="lazy"
          className="aspect-3/4 w-full object-contain transition-opacity duration-500 group-hover:opacity-85"
        />
      </Link>
    </li>
  );
}

export function StyleSection({ family }: { family: DoorFamily }) {
  return (
    <ShowcaseRow
      title={family.name}
      intro={family.intro}
      listLabel={`${family.title}: raštai`}
      prevLabel="Ankstesni raštai"
      nextLabel="Tolesni raštai"
    >
      {family.patterns.map((p) => (
        <PatternCard key={p.number} family={family} pattern={p} />
      ))}
    </ShowcaseRow>
  );
}
