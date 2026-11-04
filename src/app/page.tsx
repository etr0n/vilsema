import type { Metadata } from "next";
import Link from "next/link";
import { photos, projects } from "@/lib/site-data";
import { asset } from "@/lib/utils";
import { EnquiryForm } from "@/components/site/enquiry";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import { ProjectStrip } from "@/components/site/project-strip";
import { ParallaxImage } from "@/components/site/parallax-image";
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
        {/* Full-screen photo; the header is see-through over it until you scroll */}
        <section className="overflow-hidden">
          <ParallaxImage
            src={asset(photos.interiorDoorsHero)}
            alt="Šviesiai pilkos vidaus durys su juoda rankena"
            priority
            className="h-svh min-h-[36rem] w-full"
            focusY={0.55}
            focusAt={0.78}
            mediaClassName="hero-zoom"
          >
            <div aria-hidden className="absolute inset-0 bg-black/45" />
            <div className="page-container relative z-10 flex h-full flex-col items-center justify-center pt-20 text-center">
              <div className="hero-text flex max-w-5xl flex-col items-center text-white">
                <h1 className="text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                  Vidaus ir lauko durys jūsų namams
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-8 text-pretty">
                  Padėsime išsirinkti, atvyksime išmatuoti ir sumontuosime. Jums nereikės rūpintis niekuo.
                </p>
                <a
                  href="#produktai"
                  className="mt-10 bg-hero-cta px-8 py-4 text-sm font-medium uppercase tracking-[0.14em] text-hero-cta-text transition-colors hover:bg-menu hover:text-[var(--on-brand)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Peržiūrėti produktus
                </a>
              </div>
            </div>
          </ParallaxImage>
        </section>
  
        <section id="produktai" className="scroll-mt-20">
          <div className="page-container pb-28 pt-28 sm:pb-40 sm:pt-36">
            <ScrollReveal className="grid gap-12 md:flex md:justify-between md:gap-x-12">
              {productCategories.map((c) => (
                <div key={c.href} className="md:max-w-sm">
                  <h2 className="text-2xl font-normal">{c.title}</h2>
                  <p className="mt-4 text-xl font-normal leading-relaxed">{c.text}</p>
                  <Link
                    href={c.href}
                    aria-label={`Peržiūrėti: ${c.title}`}
                    className="mt-6 inline-block text-xl font-medium transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-hero-text"
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
                  className="inline-block text-xl font-normal transition-colors hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
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
              <h2 className="mb-12 text-3xl font-normal tracking-tight sm:text-4xl lg:col-span-4 lg:mb-0">
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
            <h2 className="mb-12 text-3xl font-normal tracking-tight sm:text-4xl lg:col-span-4 lg:mb-0 lg:mt-6.5">
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
