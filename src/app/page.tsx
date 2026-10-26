import type { Metadata } from "next";
import Link from "next/link";
import { projects, contact, contactHref } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { EnquiryForm } from "@/components/site/enquiry";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ProjectStrip } from "@/components/site/project-strip";
import { faq } from "@/lib/faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <section className="overflow-hidden bg-menu pt-20 text-hero-foreground">
        <div className="page-container grid gap-10 pb-16 pt-4 md:min-h-[calc(100svh-5rem)] md:grid-cols-12 md:items-center md:gap-x-6 md:py-0">
          <div className="hero-text md:col-span-7 md:py-24">
            <h1 className="text-[clamp(2.441rem,2.441rem+2.1111vw,5.063rem)] font-medium leading-none text-balance">
              Vidaus ir lauko durys jūsų namams
            </h1>
            <p className="mt-8 max-w-xl text-2xl font-normal leading-snug">
              Padedame išsirinkti duris, atvykstame išmatuoti ir montuojame Kaune.
            </p>
            <a
              href="#produktai"
              className="mt-12 inline-flex items-center gap-2 bg-hero-foreground px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-hero transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero-foreground"
            >
              Peržiūrėti produktus
            </a>
          </div>
          <div aria-hidden="true" className="aspect-square bg-neutral-300 md:col-span-5 md:-mr-[calc(max(0px,(100vw-1440px)/2)+2rem)] md:aspect-auto md:self-stretch lg:-mr-[calc(max(0px,(100vw-1440px)/2)+3rem)]" />
        </div>
      </section>

      <section id="produktai" className="page-container scroll-mt-20 py-28 sm:py-40">
        <ScrollReveal className="grid gap-6 md:grid-cols-2">
          <Link
            href="/vidaus-durys"
            className="group relative block aspect-[4/5] overflow-hidden bg-hero sm:aspect-[4/3]"
          >
            <img
              src={asset("/images/projektai/vidaus-durys-01-lg.webp")}
              alt="Vidaus durys"
              className="h-full w-full object-cover object-[40%_center] transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-hero/15" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground sm:p-8">
              <h2 className="text-2xl font-normal uppercase tracking-tight sm:text-3xl">
                Vidaus durys
              </h2>
            </div>
          </Link>
          <Link
            href="/lauko-durys"
            className="group relative block aspect-[4/5] overflow-hidden bg-[#7A6A48] sm:aspect-[4/3]"
          >
            <div className="absolute inset-x-0 bottom-0 p-6 text-hero-foreground sm:p-8">
              <h2 className="text-2xl font-normal uppercase tracking-tight sm:text-3xl">
                Lauko durys
              </h2>
            </div>
          </Link>
          <Link
            href="/katalogai"
            className="group relative block aspect-[4/5] overflow-hidden bg-sage sm:aspect-[4/3] md:col-span-2 md:aspect-[3/1]"
          >
            <div className="absolute inset-x-0 bottom-0 p-6 text-foreground sm:p-8">
              <h2 className="text-2xl font-normal uppercase tracking-tight sm:text-3xl">Katalogai</h2>
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

      <section className="bg-menu text-hero-foreground">
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <h2 className="mb-12 text-2xl font-normal uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0 lg:mt-6.5">
              Dažnai užduodami klausimai
            </h2>
            <Accordion type="single" collapsible className="lg:col-span-7 lg:col-start-6">
              {faq.map(([q, a], i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-hero-foreground/30">
                  <AccordionTrigger className="gap-6 py-7 text-left text-2xl font-normal hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hero-foreground [&>svg]:size-5 [&>svg]:text-hero-foreground">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 text-2xl font-normal leading-snug text-hero-foreground [&_a]:text-hero-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      <section id="susisiekite" className="scroll-mt-20">
        <div>
          <div className="page-container py-16 sm:py-20">
            <dl className="grid gap-10 text-2xl font-normal leading-snug sm:grid-cols-2 lg:flex lg:justify-between">
              <div className="grid content-start gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">Adresas</dt>
                <dd>
                  <a
                    href={contactHref.address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-60"
                  >
                    {contact.address.split(/,\s(?=\d{5})/).map((line, i, lines) => (
                      <span key={line} className="block">
                        {line}
                        {i < lines.length - 1 && ","}
                      </span>
                    ))}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">Telefonas</dt>
                <dd>
                  <a href={contactHref.phone} className="transition-opacity hover:opacity-60">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                  El. paštas
                </dt>
                <dd>
                  <a href={contactHref.email} className="transition-opacity hover:opacity-60">
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="grid content-start gap-2">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                  Darbo laikas
                </dt>
                <dd>{contact.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="page-container pb-20 pt-28 sm:pb-28 sm:pt-40">
          <ScrollReveal>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
              <h2 className="mb-12 text-2xl font-normal uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0">
                Susisiekite
              </h2>
              <div className="lg:col-span-7 lg:col-start-6">
                <EnquiryForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
