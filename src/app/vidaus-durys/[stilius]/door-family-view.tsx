import Link from "next/link";
import type { DoorFamily } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { patternHref } from "../door-details";

// Every pattern of a style; each opens its own product page.
export function DoorFamilyView({ family }: { family: DoorFamily }) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {family.patterns.map((p, i) => (
        <li key={p.number}>
          <Link
            href={patternHref(family.slug, p.number)}
            aria-label={`${family.title}, raštas ${p.number}`}
            className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <span className="block bg-stage">
              <img
                src={asset(p.image)}
                alt=""
                loading={i < 8 ? "eager" : "lazy"}
                className="aspect-3/4 w-full object-contain mix-blend-multiply transition-opacity duration-500 group-hover:opacity-85"
              />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
