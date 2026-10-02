import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/site/layout";
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

const faq = [
  ["Kaip su jumis susisiekti?", "Galite paskambinti, užpildyti užklausos formą arba apsilankyti parduotuvėje."],
  ["Ar padedate išsirinkti duris?", "Taip. Aptariame jūsų erdvę ir poreikius bei padedame pasirinkti tinkamas duris."],
  ["Ar durys gaminamos pagal individualius matmenis?", "Vidaus durys gali būti gaminamos pagal individualius matmenis."],
  ["Kokios spalvos ir apdailos galimos?", "Galimos RAL paletės spalvos bei atrinktos medžio tekstūros ir spalvos."],
  ["Ar atvykstate išmatuoti?", "Taip, atvykstame išmatuoti Kaune."],
  ["Ar montuojate duris?", "Taip, duris montuojame Kaune."],
  ["Kur rasti kainas?", "Kainą pateikiame gavę jūsų užklausą."],
  ["Kur rasti katalogus?", "Vidaus ir lauko durų katalogai bus pateikti Katalogų puslapyje."],
] as const;

export default function Faq() {
  return (
    <>
      <PageHeader title="Dažnai užduodami klausimai" />
      <Section>
        <Accordion type="single" collapsible className="max-w-3xl">
          {faq.map(([q, a], i) => (
            <AccordionItem key={i} value={`q${i}`} className="border-0">
              <AccordionTrigger className="py-7 text-left text-base font-light hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="pb-7 text-sm font-light leading-6 text-foreground/50">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
    </>
  );
}
