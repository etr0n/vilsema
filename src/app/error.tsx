"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonBase } from "@/components/site/button-styles";
import { PageHeader, Section } from "@/components/site/layout";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <PageHeader
        title="Puslapis neužsikrovė"
        intro="Įvyko klaida kraunant puslapį. Pabandykite dar kartą arba grįžkite į pradžią."
        brand
        overlap={false}
      />
      <Section className="pt-20 sm:pt-28">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <button type="button" onClick={() => retry()} className={`${buttonBase} text-sm tracking-[0.14em]`}>
            Bandyti dar kartą
          </button>
          <Link href="/" className={`${buttonBase} text-sm tracking-[0.14em]`}>
            Į pradžią
          </Link>
        </div>
      </Section>
    </>
  );
}
