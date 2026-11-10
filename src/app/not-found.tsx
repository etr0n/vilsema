import type { Metadata } from "next";
import Link from "next/link";
import { buttonBase } from "@/components/site/button-styles";

export const metadata: Metadata = {
  title: "Puslapis nerastas",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pb-28 pt-40 sm:pt-48">
      <div className="page-container flex flex-col items-center text-center">
        <h1 className="text-4xl font-normal leading-[1.2] sm:text-5xl lg:text-[3.375rem]">
          Atsiprašome, kažkas nepavyko
        </h1>
        <p className="mt-4 max-w-3xl text-xl leading-[30px] text-pretty">
          Deja, nepavyko rasti puslapio, kurio ieškote. Grįžkite į pradžią arba susisiekite su mumis, jei turite
          klausimų.
        </p>
        <Link href="/" className={`${buttonBase} mt-10 text-sm tracking-[0.14em]`}>
          Į pradžią
        </Link>
      </div>
    </section>
  );
}
