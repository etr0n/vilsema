import type { Metadata } from "next";
import { PanelPage } from "@/components/site/layout";
import { faq } from "@/lib/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "DUK",
  description: "Dažniausiai užduodami klausimai apie durų pasirinkimą, matavimą ir montavimą.",
  openGraph: {
    title: "DUK — Vilsema",
    description: "Atsakymai apie durų pasirinkimą, matavimą ir kainas.",
    type: "website",
  },
};

export default function Faq() {
  return (
    <PanelPage
      title="Dažnai užduodami klausimai"
      intro="Atsakymai į dažniausiai užduodamus klausimus apie durų pasirinkimą, matavimą, montavimą ir kainas."
    >
      <Accordion type="single" collapsible className="max-w-3xl">
        {faq.map(([q, a], i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-foreground/20">
            <AccordionTrigger className="py-7 text-left text-base font-light hover:no-underline">
              {q}
            </AccordionTrigger>
            <AccordionContent className="pb-7 text-sm font-light leading-6 text-foreground/70">
              {a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PanelPage>
  );
}
