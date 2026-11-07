"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { catalogues } from "@/components/site/catalogue-card";
import { useEnquiry } from "@/components/site/enquiry";
import { Logo } from "@/components/site/logo";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import {
  company,
  contact,
  contactHref,
  doorFamilies,
  photos,
  projectCategories,
  social,
} from "@/lib/site-data";
import { asset } from "@/lib/utils";

const doorFamilyHref = (slug: string) => `/vidaus-durys#${slug}`;
const worksCategoryHref = (c: string) => `/atlikti-darbai?kategorija=${encodeURIComponent(c)}`;


type Panel = "products" | "works";

const otherLinks = [
  { label: "Atlikti darbai", to: "/atlikti-darbai" },
  { label: "Apie mus", to: "/apie-mus" },
] as const;

const productLinks = [
  { label: "Vidaus durys", to: "/vidaus-durys" },
  { label: "Lauko durys", to: "/lauko-durys" },
] as const;

const katalogaiLink = { label: "Katalogai", to: "/katalogai" } as const;

// Catalogue ids match the product page slugs, so the short product label can be reused.
const catalogueLinks = catalogues.map((c) => ({
  label: productLinks.find((p) => p.to === `/${c.id}`)?.label ?? c.title,
  to: katalogaiLink.to,
}));

const contactLinks = [
  { label: "Kontaktai", to: "/kontaktai" },
  { label: "DUK", to: "/#duk" },
] as const;

function Wordmark({
  light,
  compact = false,
  logoClassName = "",
}: {
  light: boolean;
  compact?: boolean;
  logoClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Vilsema — pradžia"
      className={light ? "text-header-logo lg:transition-colors lg:duration-300 lg:ease-in-out" : "text-foreground"}
    >
      {compact ? (
        <Logo className="h-5.5 md:h-8.25" />
      ) : (
        <Logo className={logoClassName} />
      )}
    </Link>
  );
}

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-fit text-2xl font-normal leading-snug text-mega-menu-text transition-colors duration-300 hover:text-link-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mega-menu-text"
    >
      {children}
    </Link>
  );
}

// Same size as the links below it; the muted colour marks it as the group title.
function PanelHeading({
  children,
  size = "text-2xl",
}: {
  children: React.ReactNode;
  size?: string;
}) {
  return (
    <p className={`mb-6 font-display ${size} font-normal leading-snug text-mega-menu-text/60`}>
      {children}
    </p>
  );
}

function MenuPictureCard({
  href,
  label,
  ariaLabel,
  src = photos.interior,
  imgClassName = "aspect-square",
  className = "",
}: {
  href: string;
  label: string;
  ariaLabel: string;
  src?: string;
  imgClassName?: string;
  className?: string | undefined;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group relative block overflow-hidden bg-hero ${className}`}
    >
      <img
        src={asset(src)}
        alt=""
        className={`${imgClassName} w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]`}
      />
      <span className="absolute inset-0 bg-hero/15" />
      <span className="absolute inset-x-0 bottom-0 p-5 text-hero-foreground">
        <span className="text-2xl font-normal leading-snug">{label}</span>
      </span>
    </Link>
  );
}

function MegaPanel({
  open,
  switching,
  onLinkClick,
  className,
  children,
}: {
  open: boolean;
  switching: boolean;
  onLinkClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      data-open={open || undefined}
      data-switching={switching || undefined}
      className={`mega-panel absolute inset-x-0 top-full z-40 hidden bg-mega-menu text-mega-menu-text lg:block ${open ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) onLinkClick();
        }}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}

export function Header() {
  // trailingSlash: true makes paths look like "/katalogai/" — normalize to "/katalogai".
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [switching, setSwitching] = useState(false);
  // Following a link closes the menu without fading, so it doesn't linger over the next page.
  const [closeInstantly, setCloseInstantly] = useState(false);
  const closeForNavigation = () => {
    setCloseInstantly(true);
    setPanel(null);
    setMenu(false);
  };
  const [mobileGroup, setMobileGroup] = useState<Panel | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  // On the home page the bar is see-through over the hero photo until you scroll.
  const hasHeroPhoto = pathname === "/";
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    if (!hasHeroPhoto) return;
    const onScroll = () => setAtTop(window.scrollY < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHeroPhoto]);

  useEffect(() => {
    setMenu(false);
    setPanel(null);
    setMobileGroup(null);
    setCloseInstantly(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSwitching(false);
      setPanel(null);
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (headerRef.current?.contains(t) && !t.closest("[data-header-overlay]")) return;
      setSwitching(false);
      setPanel(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const navItem = (label: string, to: string, which?: Panel) => (
    <Link
      href={to}
      aria-expanded={which ? panel === which : undefined}
      onClick={(e) => {
        if (!which) {
          closeForNavigation();
          return;
        }
        e.preventDefault();
        setCloseInstantly(false);
        setSwitching(panel !== null && panel !== which);
        setPanel((p) => (p === which ? null : which));
      }}
      className="inline-flex items-center py-7 text-sm font-medium uppercase tracking-[0.14em]"
    >
      {label}
      {which && (
        <ChevronDown
          aria-hidden
          className={`ml-1.5 size-3.5 transition-transform duration-300 ${panel === which ? "rotate-180" : ""}`}
        />
      )}
    </Link>
  );

  const mobileGroupToggle = (which: Panel, label: string) => (
    <button
      type="button"
      aria-expanded={mobileGroup === which}
      onClick={() => setMobileGroup((v) => (v === which ? null : which))}
      className="flex items-center justify-between py-3 text-left text-2xl font-normal"
    >
      {label}
      <ChevronDown
        className={`-mr-0.75 size-4 transition-transform duration-200 ${mobileGroup === which ? "rotate-180" : ""}`}
      />
    </button>
  );

  const mobileSection = (heading: string, links: readonly { label: string; to: string }[]) => (
    <div className="pt-5 first:pt-2">
      <p className="py-1.5 font-display text-lg font-normal text-mega-menu-text/60">
        {heading}
      </p>
      {links.map((l) => (
        <Link key={l.label} href={l.to} className="block py-1.5 text-lg font-normal">
          {l.label}
        </Link>
      ))}
    </div>
  );

  const open = panel !== null || menu;
  const overHero = hasHeroPhoto && atTop && !open;

  return (
    <header
      ref={headerRef}
      // The mobile menu paints the header itself white; layering a white bar over the orange
      // background left a sub-pixel orange seam at the bar's bottom edge on phones.
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${menu ? "bg-mega-menu" : overHero ? "bg-transparent" : "bg-header"} ${open ? "[--header-text:var(--mega-menu-text)] [--header-logo:var(--mega-menu-logo)]" : ""} ${closeInstantly && !open ? "[&_*]:transition-none!" : ""}`}
    >
      {/* Fades in alongside the panel reveal, so bar and panel read as one surface */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-mega-menu transition-opacity ease-in-out max-lg:hidden ${panel !== null ? "opacity-100 duration-300" : "opacity-0 duration-200"}`}
      />
      <div className="page-container relative flex h-20 items-center justify-between gap-8">
        <div className="shrink-0">
          <Wordmark light compact />
        </div>
        <nav
          className="hidden items-center gap-7 text-sm font-medium uppercase tracking-[0.14em] text-header-text lg:flex lg:transition-colors lg:duration-300 lg:ease-in-out"
          aria-label="Pagrindinė navigacija"
        >
          {navItem("Produktai", "/vidaus-durys", "products")}
          {navItem("Atlikti darbai", "/atlikti-darbai", "works")}
          {navItem("Apie mus", "/apie-mus")}
          {navItem("Kontaktai", "/kontaktai")}
        </nav>
        <button
          aria-label={menu ? "Uždaryti meniu" : "Atidaryti meniu"}
          className="-mr-2 p-2 text-header-text lg:hidden transition-opacity hover:opacity-60"
          onClick={() => {
            setCloseInstantly(false);
            setMenu((v) => !v);
          }}
        >
          {/* Visible glyph (not Lucide's padded box) is ~3/4 of the logo height; the X is a bit smaller to balance its diagonals */}
          {menu ? (
            <X
              absoluteStrokeWidth
              strokeWidth={1.5}
              className="size-6.5 -mr-1.5 md:size-10 md:mr-[-9.5px]"
            />
          ) : (
            <Menu
              absoluteStrokeWidth
              strokeWidth={1.5}
              className="mr-[-3.4px] size-6.25 md:mr-[-5.75px] md:size-9.75"
            />
          )}
        </button>
      </div>

      <div
        aria-hidden
        data-header-overlay
        className={`fixed inset-x-0 bottom-0 top-20 z-30 bg-foreground/30 transition-opacity ease-in-out ${panel !== null ? "duration-300 opacity-100" : "pointer-events-none opacity-0 duration-200"
          }`}
      />

      <MegaPanel
        open={panel === "products"}
        switching={switching}
        onLinkClick={closeForNavigation}
        className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
      >
        <div className="col-span-9 col-start-1 row-start-1 grid grid-cols-9 gap-x-6 content-start">
          <div className="col-span-3">
            <PanelHeading>Durys</PanelHeading>
            <div className="flex flex-col gap-3">
              {productLinks.map((l) => (
                <PanelLink key={l.label} href={l.to}>
                  {l.label}
                </PanelLink>
              ))}
            </div>
          </div>
          <div className="col-span-3">
            <PanelHeading>Vidaus durų stiliai</PanelHeading>
            <div className="flex flex-col gap-3">
              {doorFamilies.map((f) => (
                <PanelLink key={f.slug} href={doorFamilyHref(f.slug)}>
                  {f.name}
                </PanelLink>
              ))}
            </div>
          </div>
          <div className="col-span-3">
            <PanelHeading>Katalogai</PanelHeading>
            <div className="flex flex-col gap-3">
              {catalogueLinks.map((l) => (
                <PanelLink key={l.label} href={l.to}>
                  {l.label}
                </PanelLink>
              ))}
            </div>
          </div>
        </div>
        {/* Same 2-up grid as the Atlikti darbai panel, so the single card matches its size and position */}
        <div className="pointer-events-none col-span-7 col-start-6 row-start-1 grid grid-cols-2 gap-3">
          <MenuPictureCard
            href="/vidaus-durys"
            label="Vidaus durys"
            ariaLabel="Vidaus durys"
            src="/images/projektai/vidaus-durys-01-lg.webp"
            className="pointer-events-auto col-start-2"
          />
        </div>
      </MegaPanel>


      <MegaPanel
        open={panel === "works"}
        switching={switching}
        onLinkClick={closeForNavigation}
        className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
      >
        <div className="col-span-5">
          <PanelHeading>Darbų kategorijos</PanelHeading>
          <div className="flex flex-col gap-3">
            {projectCategories.map((c) => (
              <PanelLink key={c} href={worksCategoryHref(c)}>
                {c}
              </PanelLink>
            ))}
          </div>
        </div>
        <div className="col-span-7 col-start-6 grid grid-cols-2 gap-3">
          <MenuPictureCard
            href={worksCategoryHref("Vidaus durys")}
            label="Vidaus durys"
            ariaLabel="Atlikti darbai — Vidaus durys"
            src="/images/projektai/vidaus-durys-pasleptos-01-lg.webp"
          />
          <MenuPictureCard
            href={worksCategoryHref("Lauko durys")}
            label="Lauko durys"
            ariaLabel="Atlikti darbai — Lauko durys"
          />
        </div>
      </MegaPanel>

      {menu && (
        <div className="page-container relative z-40 h-[calc(100svh-5rem)] overflow-y-auto bg-mega-menu pb-8 pt-2 text-mega-menu-text lg:hidden">
          <nav
            className="flex flex-col"
            aria-label="Mobilioji navigacija"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) closeForNavigation();
            }}
          >
            {mobileGroupToggle("products", "Produktai")}
            {mobileGroup === "products" && (
              <div className="mega-in pb-4">
                {mobileSection("Durys", productLinks)}
                {mobileSection(
                  "Vidaus durų stiliai",
                  doorFamilies.map((f) => ({ label: f.name, to: doorFamilyHref(f.slug) })),
                )}
                {mobileSection("Katalogai", catalogueLinks)}
              </div>
            )}
            {mobileGroupToggle("works", "Atlikti darbai")}
            {mobileGroup === "works" && (
              <div className="mega-in pb-4">
                {mobileSection(
                  "Darbų kategorijos",
                  projectCategories.map((c) => ({ label: c, to: worksCategoryHref(c) })),
                )}
              </div>
            )}
            <Link href="/apie-mus" className="py-3 text-2xl font-normal">
              Apie mus
            </Link>
            <Link href="/kontaktai" className="py-3 text-2xl font-normal">
              Kontaktai
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

const footerLinkClass = "w-fit transition-colors hover:text-link-hover";

// Kastrup-style: a black title a step larger than the 20px links, with airy 30px lines.
function FooterGroup({
  title,
  className,
  gap = "gap-2",
  children,
}: {
  title: string;
  className: string;
  gap?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="mb-5 font-display text-2xl font-normal leading-snug">{title}</p>
      <div className={`flex flex-col ${gap} text-xl font-normal leading-normal`}>{children}</div>
    </div>
  );
}

function FooterContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <p className="font-bold">{label}</p>
      {children}
    </div>
  );
}

const [addressStreet, ...addressRest] = contact.address.split(", ");

// Drawn inline: Lucide's brand icons are deprecated and due to be removed.
const socialIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "size-6",
} as const;

function FacebookIcon() {
  return (
    <svg {...socialIconProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...socialIconProps}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-background py-20 text-foreground">
      {/* Groups start on the same grid columns as the mega menu (1 / 4 / 7 / 10) */}
      <div className="page-container grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-12">
        <div className="col-span-2 lg:col-span-3">
          <Link href="/" aria-label="Vilsema — pradžia" className="inline-block">
            <Logo className="h-8.25" markClassName="fill-menu" />
          </Link>
          <div className="mt-8 flex gap-5">
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vilsema Facebook"
              // The "f" sits ~6px inside its 24px box; pull it onto the logo's left edge.
              className="-ml-1.5 transition-colors hover:text-link-hover"
            >
              <FacebookIcon />
            </a>
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Vilsema Instagram"
              className="transition-colors hover:text-link-hover"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>
        <FooterGroup title="Kontaktai" className="col-span-2 lg:col-span-3 lg:col-start-4" gap="gap-5">
          <FooterContactBlock label="Adresas">
            <a
              href={contactHref.address}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLinkClass}
            >
              {addressStreet},
              <br />
              {addressRest.join(", ")}
            </a>
          </FooterContactBlock>
          <FooterContactBlock label="Susisiekite">
            <a href={contactHref.phone} className={footerLinkClass}>
              {contact.phone}
            </a>
            <a href={contactHref.email} className={footerLinkClass}>
              {contact.email}
            </a>
          </FooterContactBlock>
          <FooterContactBlock label="Darbo laikas">
            <p>{contact.hours}</p>
          </FooterContactBlock>
        </FooterGroup>
        <FooterGroup title="Produktai" className="lg:col-span-3 lg:col-start-7">
          {[
            productLinks[0],
            ...doorFamilies.map((f) => ({ label: f.name, to: doorFamilyHref(f.slug) })),
            ...productLinks.slice(1),
            katalogaiLink,
          ].map((l) => (
            <Link key={l.to} href={l.to} className={footerLinkClass}>
              {l.label}
            </Link>
          ))}
        </FooterGroup>
        <FooterGroup title="Informacija" className="lg:col-span-3 lg:col-start-10">
          {[...otherLinks, ...contactLinks].map((l) => (
            <Link key={l.to} href={l.to} className={footerLinkClass}>
              {l.label}
            </Link>
          ))}
        </FooterGroup>
      </div>
      <div className="page-container mt-20 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span>© {new Date().getFullYear()} Vilsema</span>
        <span>{company.legalName}</span>
        <span>Įmonės kodas: {company.code}</span>
      </div>
    </footer>
  );
}

export function Cta({
  children,
  onClick,
  className = "",
  inverted = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 uppercase border transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${inverted
        ? "border-hero-foreground bg-transparent px-6 text-sm tracking-[0.14em] text-hero-foreground hover:bg-hero-foreground hover:text-menu focus-visible:outline-hero-foreground"
        : "border-button bg-button px-9 text-[11px] tracking-[0.18em] text-primary-foreground hover:border-button-hover hover:bg-button-hover hover:text-white focus-visible:outline-foreground"
        } ${className}`}
    >
      {children}
    </button>
  );
}

// Cta that opens the enquiry dialog — usable from server pages (no onClick prop needed).
export function EnquireButton({
  children,
  model,
  className = "",
}: {
  children: React.ReactNode;
  model?: string;
  className?: string;
}) {
  const { open } = useEnquiry();
  return (
    <Cta onClick={() => open(model)} className={className}>
      {children}
    </Cta>
  );
}

export function PageHeader({
  title,
  intro,
  overlap = true,
  plain = false,
  brand = false,
}: {
  title: string;
  intro?: string;
  // By default the next section is pulled up into the band; turn off to start it below on white.
  overlap?: boolean;
  // No band at all: header sits on the white page background.
  plain?: boolean;
  // Band in the menu bar colour, continuing it down behind the title.
  brand?: boolean;
}) {
  return (
    <div
      className={
        plain
          ? ""
          : brand
          ? `bg-header ${overlap ? "pb-56 [&+*]:-mt-56" : ""}`
          : overlap
          ? "bg-page-hero pb-56 [&+*]:-mt-56 [&+*:has([data-empty])]:bg-page-hero [&+*:has([data-empty])]:[box-shadow:0_0_0_100vmax_var(--page-hero-color)] [&+*:has([data-empty])]:[clip-path:inset(0_-100vmax)]"
          : "bg-page-hero"
      }
    >
      <header className="page-container pb-16 pt-36 sm:pb-20 sm:pt-48">
        <ScrollReveal>
          <h1 className={`max-w-3xl text-3xl font-normal leading-tight tracking-tight sm:text-5xl ${brand ? "text-header-text" : "text-page-hero-text"}`}>
            {title}
          </h1>
          {intro && (
            <p className={`mt-8 max-w-xl text-lg leading-7 ${brand ? "text-header-text/75" : "text-ink-2"}`}>{intro}</p>
          )}
        </ScrollReveal>
      </header>
    </div>
  );
}

export function PanelPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-page-hero">
      <header className="page-container pb-16 pt-36 sm:pb-20 sm:pt-48">
        <ScrollReveal>
          <h1 className="max-w-3xl text-3xl font-normal leading-tight tracking-tight text-page-hero-text sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-8 max-w-xl text-lg leading-7 text-ink-2">{intro}</p>}
        </ScrollReveal>
      </header>
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 bg-card lg:left-[max(0px,calc((100%-var(--container-page))/2-6.5rem))]"
        />
        <div className="page-container relative pb-28 pt-16 sm:pb-40 sm:pt-24">{children}</div>
      </div>
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`page-container pb-28 sm:pb-40 ${className}`}>
      <ScrollReveal>{children}</ScrollReveal>
    </section>
  );
}
