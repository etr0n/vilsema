import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DoorFamily } from "@/lib/site-data";

export const patternHref = (slug: string, pattern: number) => `/vidaus-durys/${slug}/${pattern}`;

export function DoorDetails({ family }: { family: DoorFamily }) {
  return (
    <Accordion type="multiple" className="border-t border-foreground/20">
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
          <AccordionTrigger className="gap-6 py-7 text-left text-2xl font-normal hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground [&>svg]:size-5 [&>svg]:text-foreground">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-7 text-xl font-normal leading-[30px] text-foreground">{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
