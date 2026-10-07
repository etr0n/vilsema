import type { Metadata } from "next";
import { ScrollReveal } from "@/components/site/scroll-reveal";
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
    <section className="bg-sage">
      <div className="page-container pb-28 pt-36 sm:pb-40 sm:pt-48">
        <ScrollReveal className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          <h1 className="mb-12 text-2xl font-light uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0 lg:mt-5.5">
            Dažnai užduodami klausimai
          </h1>
          <Accordion type="single" collapsible className="lg:col-span-7 lg:col-start-6">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
