import type { Metadata } from "next";
import Link from "next/link";
import { photos, projects } from "@/lib/site-data";
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
      {/* One background for both sections: two adjacent orange sections left a faint seam on phones */}
      <div className="bg-home-hero text-home-hero-text">
        <section className="overflow-hidden pt-20">
          <div className="page-container grid gap-10 pb-16 pt-4 md:grid-cols-12 md:items-center md:gap-x-6">
            <div className="hero-text md:col-span-6">
              <h1 className="text-[clamp(2.441rem,2.441rem+2.1111vw,5.063rem)] font-light leading-none text-balance">
                Vidaus ir lauko durys jūsų namams
              </h1>
              <p className="mt-8 max-w-xl text-xl leading-7.5">
                Padėsime išsirinkti, atvyksime išmatuoti ir sumontuosime. Jums nereikės rūpintis niekuo.
              </p>
              <a
                href="#produktai"
                className="mt-12 inline-flex min-h-13 items-center justify-center px-8 text-sm font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 bg-hero-cta text-hero-cta-text focus-visible:outline-hero-cta"
              >
                Peržiūrėti produktus
              </a>
            </div>
            <img
              src={asset(photos.hero)}
              alt=""
              width={1600}
              height={1600}
              fetchPriority="high"
              className="aspect-square w-full object-cover md:col-span-6"
            />
          </div>
        </section>
  
        <section id="produktai" className="scroll-mt-20">
          <div className="page-container pb-28 pt-16 sm:pb-40 sm:pt-20">
            <div aria-hidden className="h-px bg-home-hero-text" />
            <ScrollReveal className="mt-32 grid gap-12 sm:mt-36 md:flex md:justify-between md:gap-x-12">
              {productCategories.map((c) => (
                <div key={c.href} className="md:max-w-sm">
                  <h2 className="text-2xl font-normal">{c.title}</h2>
                  <p className="mt-4 text-xl font-normal leading-relaxed">{c.text}</p>
                  <Link
                    href={c.href}
                    aria-label={`Peržiūrėti: ${c.title}`}
                    className="mt-6 inline-block text-xl font-normal transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-hero-text"
                  >
                    <span className="underline decoration-1 underline-offset-[6px]">Peržiūrėti</span>
                  </Link>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>
      </div>

      <section>
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal>
            <ProjectStrip
              title="Atlikti darbai"
              projects={projects}
              cta={
                <Link
                  href="/atlikti-darbai"
                  className="inline-block text-xl font-normal transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                >
                  <span className="underline decoration-1 underline-offset-[6px]">Visi darbai</span>
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
              <h2 className="mb-12 text-3xl font-light tracking-tight sm:text-4xl lg:col-span-4 lg:mb-0">
                Susisiekite
              </h2>
              <div className="lg:col-span-7 lg:col-start-6">
                <EnquiryForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="duk" className="scroll-mt-20 bg-home-hero text-home-hero-text">
        <div className="page-container py-28 sm:py-40">
          <ScrollReveal className="lg:grid lg:grid-cols-12 lg:gap-x-6">
            <h2 className="mb-12 text-3xl font-light tracking-tight sm:text-4xl lg:col-span-4 lg:mb-0 lg:mt-6.5">
              Dažnai užduodami klausimai
            </h2>
            <Accordion type="single" collapsible className="lg:col-span-7 lg:col-start-6">
              {faq.map(([q, a], i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-home-hero-text/30">
                  <AccordionTrigger className="gap-6 py-7 text-left text-2xl font-normal hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-hero-text [&>svg]:size-5 [&>svg]:text-home-hero-text">
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 text-xl font-normal leading-relaxed text-home-hero-text [&_a]:text-home-hero-text">
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
