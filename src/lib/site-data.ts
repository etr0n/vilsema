// Laikinos nuotraukos (placeholderiai). Tikras nuotraukas įkelkite į public/images/
// ir pakeiskite kelius čia — pvz. "/images/hero.jpg".
export const photos = {
  hero: "/images/hero.webp",
  interior: "/images/interior.svg",
  doorModel: "/images/door-model.svg",
  ula: "/images/ula.svg",
};

export type InteriorDoor = {
  slug: string;
  name: string;
  category: "Klasikinės" | "Modernios" | "Elegantiškos";
  image?: string;
  alt: string;
  description: string;
};

// Laikini modeliai — pavadinimai ir nuotraukos bus patikslinti,
// kai Vilsema pateiks tikrą katalogą. Visoms naudojama viena pateikta nuotrauka.
const door = (
  n: number,
  category: InteriorDoor["category"],
  description: string,
): InteriorDoor => ({
  slug: `modelis-${String(n).padStart(2, "0")}`,
  name: `Modelis ${String(n).padStart(2, "0")}`,
  category,
  image: photos.doorModel,
  alt: `${category} vidaus durys`,
  description,
});

export const interiorDoors: InteriorDoor[] = [
  door(
    1,
    "Klasikinės",
    "Ramių linijų vidaus durys, tinkančios tiek klasikiniam, tiek santūriam šiuolaikiniam interjerui.",
  ),
  door(
    2,
    "Klasikinės",
    "Klasikinės proporcijos ir neutralus apdailos pasirinkimas pagal individualius matmenis.",
  ),
  door(
    3,
    "Klasikinės",
    "Santūrus modelis tradiciniam interjerui; spalva parenkama iš RAL paletės arba medienos tekstūrų.",
  ),
  door(4, "Modernios", "Lakoninės linijos ir šiuolaikiška apdaila moderniam interjerui."),
  door(
    5,
    "Modernios",
    "Minimalistinis modelis su galimybe rinktis RAL spalvas ir medienos tekstūras.",
  ),
  door(6, "Modernios", "Šiuolaikiškas modelis, gaminamas pagal individualius matmenis."),
  door(7, "Elegantiškos", "Subtilios detalės ir rafinuota apdaila reprezentatyviam interjerui."),
  door(8, "Elegantiškos", "Elegantiškas modelis su kruopščiai parinktomis apdailos medžiagomis."),
  door(
    9,
    "Elegantiškos",
    "Išskirtinio charakterio durys, pritaikomos pagal individualius matmenis.",
  ),
];

export const interiorCategories = ["Klasikinės", "Modernios", "Elegantiškos"] as const;

export type Project = {
  id: string;
  caption: string;
  category: "Vidaus durys" | "Lauko durys" | "Kita";
  /** Trumpas tekstas: rodomas po nuotrauka karuselėje ir padidintame vaizde. */
  description: string;
  /** Paruoštos nuotraukos pavadinimas (be -sm/-lg.webp). Nenurodžius rodomas pilkas placeholderis. */
  photo?: string;
  alt: string;
};

// Naujas atliktas darbas:
// 1. Originalią nuotrauką įdėkite į photo-originals/projektai/, pvz. kaunas-vila.jpg
// 2. Paleiskite: npm run photos
// 3. Pridėkite įrašą žemiau su photo: "kaunas-vila", trumpu aprašymu ir kategorija.
export const projects: Project[] = [
  {
    id: "p1",
    caption: "Šviesus interjeras",
    category: "Vidaus durys",
    description: "Šviesios vidaus durys, derančios prie natūralaus ąžuolo grindų.",
    alt: "Sumontuotos vidaus durys šviesiame interjere",
  },
  {
    id: "p2",
    caption: "Tikslus montavimas",
    category: "Vidaus durys",
    description: "Paslėpti vyriai ir tiksliai pritaikyta stakta prie sienos plokštumos.",
    alt: "Durų montavimo detalė šviesioje erdvėje",
  },
  {
    id: "p3",
    caption: "Ramus dizainas",
    category: "Vidaus durys",
    description: "Lakoniškos durys be rėmų, kad erdvė atrodytų rami ir vientisa.",
    alt: "Ramaus dizaino durys sumontuotoje erdvėje",
  },
  {
    id: "p4",
    caption: "Natūralūs atspalviai",
    category: "Vidaus durys",
    description: "Medienos tekstūros apdaila, parinkta pagal interjero spalvas.",
    alt: "Vidaus durys natūralių atspalvių interjere",
  },
];

// Nuotraukos kelias: "sm" — karuselei ir tinkleliui, "lg" — padidintam vaizdui.
export function projectImage(p: Project, size: "sm" | "lg"): string {
  return p.photo ? `/images/projektai/${p.photo}-${size}.webp` : photos.interior;
}

export const projectCategories = ["Vidaus durys", "Lauko durys", "Kita"] as const;

export const contact = {
  address: "Verslo g. 1, Kaunas",
  phone: "+370 600 00000",
  email: "info@vilsema.lt",
  hours: "I–V 9:00–18:00",
};

// Nuorodos: telefonas skambina, el. paštas atidaro pašto programą, adresas — Google Maps.
export const contactHref = {
  phone: `tel:${contact.phone.replace(/[^\d+]/g, "")}`,
  email: `mailto:${contact.email}`,
  address: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`,
};
