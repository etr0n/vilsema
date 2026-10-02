import type { Metadata } from "next";
import Link from "next/link";
import { photos, projects, contact, contactHref } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { EnquiryForm } from "@/components/site/enquiry";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ProjectStrip } from "@/components/site/project-strip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Nuorodos DUK atsakymuose: ryškesnės už pilką atsakymo tekstą.
const faqLink = "text-foreground underline underline-offset-2 transition-opacity hover:opacity-60";

const faq: [string, React.ReactNode][] = [
  [
    "Kaip su jumis susisiekti?",
    <>
      Galite paskambinti, užpildyti{" "}
      <a href="#susisiekite" className={faqLink}>
        užklausos formą
      </a>{" "}
      arba apsilankyti parduotuvėje.
    </>,
  ],
  [
    "Ar padedate išsirinkti duris?",
    "Taip. Aptariame jūsų erdvę ir poreikius bei padedame pasirinkti tinkamas duris.",
  ],
  [
    "Ar durys gaminamos pagal individualius matmenis?",
    "Vidaus durys gali būti gaminamos pagal individualius matmenis.",
  ],
  [
    "Kokios spalvos ir apdailos galimos?",
    "Galimos RAL paletės spalvos bei atrinktos medžio tekstūros ir spalvos.",
  ],
  ["Ar atvykstate išmatuoti?", "Taip, atvykstame išmatuoti Kaune."],
  ["Ar montuojate duris?", "Taip, duris montuojame Kaune."],
  ["Kur rasti kainas?", "Kainą pateikiame gavę jūsų užklausą."],
  [
    "Kur rasti katalogus?",
    <>
      Vidaus ir lauko durų{" "}
      <Link href="/katalogai" className={faqLink}>
        katalogai
      </Link>{" "}
      bus pateikti Katalogų puslapyje.
    </>,
  ],
];

export const metadata: Metadata = {
  title: { absolute: "Vilsema — vidaus ir lauko durys Kaune" },
  description: "Padedame išsirinkti duris, atvykstame išmatuoti ir montuojame Kaune.",
  openGraph: {
    title: "Vilsema — durys jūsų namams",
    description: "Vidaus ir lauko durys, matavimas ir montavimas Kaune.",
    type: "website",
  },
};

export default function Index() {
  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden bg-hero">
        <img
          src={asset(photos.hero)}
          alt="Vidaus durys minimalistiniame interjere"
          fetchPriority="high"
          className="hero-zoom absolute inset-0 h-full w-full object-cover object-[53%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-hero/60 to-transparent" />
        <div className="page-container relative flex min-h-[92svh] items-center justify-center py-28">
          <div className="hero-text max-w-3xl text-center text-hero-foreground">
            <h1 className="text-4xl font-extralight leading-[1.05] sm:text-6xl uppercase">
              Vidaus ir lauko durys jūsų namams
            </h1>
            <a
              href="#produktai"
              className="mt-10 inline-flex items-center gap-2 bg-hero-foreground px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-hero transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground"
            >
              Peržiūrėti produktus
            </a>
          </div>
        </div>
      </section>

      <section id="produktai" className="page-container scroll-mt-20 py-28 sm:py-40">
        <ScrollReveal className="grid gap-6 md:grid-cols-2">
          <Link
            href="/vidaus-durys"
            className="group relative block aspect-[4/5] overflow-hidden bg-hero sm:aspect-[4/3]"
          >
            <img
              src={asset(photos.interior)}
              alt="Vidaus durys"
              className="h-full w-full object-cover object-[40%_center] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-hero/15" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground sm:p-8">
              <h2 className="text-xl font-light uppercase tracking-tight sm:text-2xl">
                Vidaus durys
              </h2>
            </div>
          </Link>
          <Link
            href="/lauko-durys"
            className="group relative block aspect-[4/5] overflow-hidden bg-hero sm:aspect-[4/3]"
          >
            <img
              src={asset(photos.interior)}
              alt="Lauko durys"
              className="h-full w-full object-cover object-[60%_center] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-hero/15" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground sm:p-8">
              <h2 className="text-xl font-light uppercase tracking-tight sm:text-2xl">
                Lauko durys
              </h2>
            </div>
          </Link>
          {/* Per visą 12 stulpelių tinklelį. */}
          <Link
            href="/katalogai"
            className="group relative block aspect-[4/5] overflow-hidden bg-hero sm:aspect-[4/3] md:col-span-2 md:aspect-[3/1]"
          >
            <img
              src={asset(photos.interior)}
              alt="Katalogai"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-hero/15" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground sm:p-8">
              <h2 className="text-xl font-light uppercase tracking-tight sm:text-2xl">Katalogai</h2>
            </div>
          </Link>
        </ScrollReveal>
      </section>

      <section>
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal>
            <ProjectStrip
              title="Atlikti darbai"
              projects={projects}
              cta={
                <Link
                  href="/atlikti-darbai"
                  className="inline-flex items-center justify-center bg-foreground px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80 sm:px-8"
                >
                  Visi darbai
                </Link>
              }
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-sage">
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <h2 className="mb-12 text-2xl font-light uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0 lg:mt-5.5">
              Dažnai užduodami klausimai
            </h2>
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

      <section id="susisiekite" className="scroll-mt-20">
        <div className="page-container pb-20 pt-28 sm:pb-28 sm:pt-40">
          <ScrollReveal>
            {/* Antraštė kairėje, forma dešinėje (kaip DUK). */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
              <h2 className="mb-12 text-2xl font-light uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0">
                Susisiekite
              </h2>
              <div className="lg:col-span-7 lg:col-start-6">
                <EnquiryForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
        {/* Kontaktai vienoje eilutėje pastelinėje juostoje. */}
        <div className="bg-cream">
          <div className="page-container py-16 sm:py-20">
            <dl className="grid gap-10 text-base font-light sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">
              <div className="grid content-start gap-2 lg:col-span-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">Adresas</dt>
                <dd>
                  <a
                    href={contactHref.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-60"
                  >
                    {contact.address}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2 lg:col-span-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">Telefonas</dt>
                <dd>
                  <a href={contactHref.phone} className="transition-opacity hover:opacity-60">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2 lg:col-span-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                  El. paštas
                </dt>
                <dd>
                  <a href={contactHref.email} className="transition-opacity hover:opacity-60">
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2 lg:col-span-3">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                  Darbo laikas
                </dt>
                <dd>{contact.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
