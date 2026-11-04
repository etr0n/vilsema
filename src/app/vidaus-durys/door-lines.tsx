import Link from "next/link";
import { doorFamilies, patternCount } from "@/lib/site-data";
import { asset } from "@/lib/utils";

const href = (slug: string) => `/vidaus-durys/${slug}`;

export function DoorLines() {
  return (
    <ul className="grid gap-20 md:grid-cols-3 md:gap-x-6">
      {doorFamilies.map((f) => (
        <li key={f.slug}>
          <Link href={href(f.slug)} tabIndex={-1} aria-hidden className="block overflow-hidden">
            <img
              src={asset(f.roomImage)}
              alt=""
              loading="lazy"
              className="aspect-4/5 w-full bg-card object-cover transition-transform duration-700 ease-out hover:scale-[1.03] motion-reduce:transition-none"
            />
          </Link>
          <h3 className="mt-8 text-2xl font-normal">{f.name}</h3>
          <p className="mt-3 max-w-sm text-lg leading-7 text-ink-2 text-pretty">{f.intro}</p>
          <p className="mt-3 text-lg text-ink-2">{patternCount(f.patterns.length)}</p>
          <Link
            href={href(f.slug)}
            aria-label={`Peržiūrėti: ${f.title}`}
            className="mt-5 inline-block text-xl font-normal transition-colors hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <span className="underline decoration-1 underline-offset-[6px]">Peržiūrėti</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
