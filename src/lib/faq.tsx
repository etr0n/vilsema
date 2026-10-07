import Link from "next/link";

const faqLink = "text-foreground underline underline-offset-2 transition-opacity hover:opacity-60";

export const faq: [string, React.ReactNode][] = [
  [
    "Kaip su jumis susisiekti?",
    <>
      Galite paskambinti, užpildyti{" "}
      <Link href="/#susisiekite" className={faqLink}>
        užklausos formą
      </Link>{" "}
      arba apsilankyti parduotuvėje Kaune.
    </>,
  ],
  [
    "Ar padedate išsirinkti duris?",
    "Taip. Aptariame jūsų erdvę ir poreikius bei padedame pasirinkti tinkamas duris.",
  ],
  [
    "Ar durys gaminamos pagal individualius matmenis?",
    "Vidaus ir lauko duris gaminame pagal individualius matmenis, pritaikydami jas konkrečiai erdvei."
  ],
  [
    "Kokios spalvos ir apdailos galimos?",
    "Galimos RAL paletės spalvos bei atrinktos medžio tekstūros ir spalvos.",
  ],
  ["Ar teikiate matavimo ir montavimo paslaugas?", "Taip, Kaune pasirūpiname visu procesu, nuo tikslių matavimų iki profesionalaus durų montavimo."],
  ["Kur rasti kainas?", "Preliminarias kainas rasite mūsų svetainėje. Gavę jūsų užklausą, galėsime tiksliau įvertinti galutinę kainą."],
  [
    "Kur rasti katalogus?",
    <>
      Vidaus ir lauko durų katalogai yra pateikti{" "}
      <Link href="/katalogai" className={faqLink}>
        katalogų puslapyje
      </Link>
      .
    </>,
  ],
];
