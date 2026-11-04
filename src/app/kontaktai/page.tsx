import type { Metadata } from "next";
import { EnquiryForm } from "@/components/site/enquiry";
import { PanelPage } from "@/components/site/layout";
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

const [addressStreet, ...addressRest] = contact.address.split(", ");

const linkClass = "transition-colors hover:text-link-hover";

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {/* Bold black label above the value, the same pattern as the footer's contact blocks */}
      <dt className="mb-1 text-xl font-semibold">{label}</dt>
      <dd className="text-xl font-normal leading-relaxed">{children}</dd>
    </div>
  );
}

export default function Contact() {
  return (
    <PanelPage
      title="Kontaktai"
      intro="Susisiekite su mumis – atsakysime į klausimus, padėsime išsirinkti duris ir suderinsime matavimo laiką."
    >
      {/* Same columns as the home page contact section, so both forms line up */}
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-6">
        <dl className="grid content-start gap-10 lg:col-span-4">
          <ContactItem label="Adresas">
            <a
              href={contactHref.address}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {addressStreet},
              <br />
              {addressRest.join(", ")}
            </a>
          </ContactItem>
          <ContactItem label="Telefonas">
            <a href={contactHref.phone} className={linkClass}>
              {contact.phone}
            </a>
          </ContactItem>
          <ContactItem label="El. paštas">
            <a href={contactHref.email} className={linkClass}>
              {contact.email}
            </a>
          </ContactItem>
          <ContactItem label="Darbo laikas">{contact.hours}</ContactItem>
        </dl>
        <div className="lg:col-span-7 lg:col-start-6">
          <EnquiryForm />
        </div>
      </div>
    </PanelPage>
  );
}
