import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/enquiry";
import { PageHeader, Section } from "@/components/site/layout";
import { contact, contactHref } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Kontaktai",
  description: "Vilsemos parduotuvė Kaune: adresas, darbo laikas ir užklausos forma.",
  openGraph: {
    title: "Kontaktai — Vilsema",
    description: "Susisiekite su Vilsema dėl durų pasirinkimo ir montavimo Kaune.",
    type: "website",
  },
};

export default function Contact() {
  return (
    <>
      <PageHeader title="Kontaktai" />
      <Section>
        <div className="grid gap-16 lg:grid-cols-[5fr_7fr] lg:gap-24">
          <dl className="grid content-start gap-10 text-base font-light">
            <div className="grid">
              <dt className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/65">
                Adresas
              </dt>
              <dd className="py-3">
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
            <div className="grid">
              <dt className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/65">
                Telefonas
              </dt>
              <dd className="py-3">
                <a href={contactHref.phone} className="transition-opacity hover:opacity-60">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div className="grid">
              <dt className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/65">
                El. paštas
              </dt>
              <dd className="py-3">
                <a href={contactHref.email} className="transition-opacity hover:opacity-60">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="grid">
              <dt className="mb-3 text-xs uppercase tracking-[0.2em] text-foreground/65">
                Darbo laikas
              </dt>
              <dd className="py-3">{contact.hours}</dd>
            </div>
          </dl>
          <div>
            <EnquiryForm />
          </div>
        </div>

        <div className="mt-20 grid aspect-[16/9] place-items-center bg-muted text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Žemėlapis bus pridėtas, kai bus patvirtintas adresas
        </div>
      </Section>
    </>
  );
}
