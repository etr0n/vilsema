import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/site-data";
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
  title: { absolute: "Vilsema | vidaus ir lauko durys Kaune" },
  description: "Padedame išsirinkti duris, atvykstame išmatuoti ir montuojame Kaune.",
  openGraph: {
    title: "Vilsema | durys jūsų namams",
    description: "Vidaus ir lauko durys, matavimas ir montavimas Kaune.",
    type: "website",
  },
};

const productCategories = [
  { title: "Vidaus durys", href: "/vidaus-durys", text: "Durys gaminamos pagal individualius matmenis." },
  {
    title: "Lauko durys",
    href: "/lauko-durys",
    text: "Padedame išsirinkti lauko duris, atvykstame išmatuoti ir sumontuojame Kaune.",
  },
  { title: "Katalogai", href: "/katalogai", text: "Atsisiųskite vidaus ir lauko durų katalogus PDF formatu." },
];

export default function Index() {
  return (
    <>
      <section className="overflow-hidden bg-home-hero pt-20 text-home-hero-text">
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
              className="mt-12 inline-flex min-h-13 items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 bg-home-hero-text text-hero focus-visible:outline-home-hero-text"
            >
              Peržiūrėti produktus
            </a>
          </div>
          <div aria-hidden="true" className="aspect-square bg-neutral-300 md:col-span-5 md:-mr-[calc(max(0px,(100vw-1440px)/2)+2rem)] md:aspect-auto md:self-stretch lg:-mr-[calc(max(0px,(100vw-1440px)/2)+3rem)]" />
        </div>
      </section>

      <section id="produktai" className="scroll-mt-20 bg-home-hero text-home-hero-text">
        <div className="page-container pb-28 pt-16 sm:pb-40 sm:pt-20">
          <div aria-hidden className="h-px bg-home-hero-text" />
          <ScrollReveal className="mt-16 grid gap-12 sm:mt-20 md:flex md:justify-between md:gap-x-12">
            {productCategories.map((c) => (
              <div key={c.href} className="md:max-w-sm">
                <h2 className="text-2xl font-normal uppercase tracking-tight sm:text-3xl">{c.title}</h2>
                <p className="mt-6 text-2xl font-normal leading-snug">{c.text}</p>
                <Link
                  href={c.href}
                  aria-label={`Peržiūrėti: ${c.title}`}
                  className="mt-6 inline-block text-sm font-medium uppercase tracking-[0.14em] underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-hero-text"
                >
                  Peržiūrėti
                </Link>
              </div>
            ))}
          </ScrollReveal>
        </div>
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
                  className="inline-flex min-h-13 items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 bg-button text-button-text focus-visible:outline-foreground"
                >
                  Visi darbai
                </Link>
              }
            />
          </ScrollReveal>
        </div>
      </section>

      <section id="susisiekite" className="scroll-mt-20">
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

      <section className="bg-sand text-foreground">
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <h2 className="mb-12 text-2xl font-normal uppercase tracking-tight sm:text-3xl lg:col-span-4 lg:mb-0 lg:mt-6.5">
              Dažnai užduodami klausimai
            </h2>
            <Accordion type="single" collapsible className="lg:col-span-7 lg:col-start-6">
              {faq.map(([q, a], i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-foreground/20">
                  <AccordionTrigger className="gap-6 py-7 text-left text-2xl font-normal hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground [&>svg]:size-5 [&>svg]:text-foreground">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 text-2xl font-normal leading-snug text-foreground [&_a]:text-foreground">
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
