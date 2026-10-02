"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEnquiry } from "@/components/site/enquiry";
import { Logo, LogoMark } from "@/components/site/logo";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import {
  contact,
  contactHref,
  interiorCategories,
  photos,
  projectCategories,
} from "@/lib/site-data";
import { asset } from "@/lib/utils";

const doorsCategoryHref = (c: string) => `/vidaus-durys?kategorija=${encodeURIComponent(c)}`;
const worksCategoryHref = (c: string) => `/atlikti-darbai?kategorija=${encodeURIComponent(c)}`;

type Panel = "products" | "catalogues" | "works" | "contact";

const otherLinks = [{ label: "Atlikti darbai", to: "/atlikti-darbai" }] as const;

const productLinks = [
  { label: "Vidaus durys", to: "/vidaus-durys" },
  { label: "Lauko durys", to: "/lauko-durys" },
] as const;

// Produktų meniu: „Visos durys“ atidaro vidaus durų puslapį su pasirinktu filtru „Visos“.
const menuProductLinks = [{ label: "Visos durys", to: "/vidaus-durys" }, ...productLinks] as const;

const katalogaiLink = { label: "Katalogai", to: "/katalogai" } as const;

// Produktų meniu: kiekvienas punktas atidaro Katalogų puslapį ties tuo katalogu.
const catalogueLinks = [
  { label: "Vidaus durų", to: "/katalogai#vidaus-durys" },
  { label: "Lauko durų", to: "/katalogai#lauko-durys" },
] as const;

const contactLinks = [
  { label: "Kontaktai", to: "/kontaktai" },
  { label: "Apie mus", to: "/apie-mus" },
  { label: "DUK", to: "/duk" },
] as const;

function Wordmark({ light, compact = false }: { light: boolean; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Vilsema — pradžia"
      className={light ? "text-hero-foreground" : "text-foreground"}
    >
      {compact ? (
        <>
          <LogoMark className="sm:hidden" />
          <Logo className="hidden sm:block" />
        </>
      ) : (
        <Logo />
      )}
    </Link>
  );
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.75rem] uppercase tracking-[0.14em] text-foreground">{children}</p>;
}

// Meniu punktas: didžiosiomis raidėmis, didesnis už kategorijos antraštę; užvedus pele tekstas pašviesėja.
function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="w-fit text-sm uppercase text-foreground transition-colors duration-300 hover:text-foreground/50 focus-visible:text-foreground/50"
    >
      {children}
    </Link>
  );
}

// Nuotraukos kortelė išskleistame meniu: pavadinimas nuotraukos apačioje, kaip pradžios puslapio kortelėse.
function MenuPictureCard({
  href,
  label,
  ariaLabel,
  className = "",
}: {
  href: string;
  label: string;
  ariaLabel: string;
  className?: string | undefined;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`group relative block overflow-hidden bg-hero ${className}`}
    >
      <img
        src={asset(photos.interior)}
        alt=""
        className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <span className="absolute inset-0 bg-hero/15" />
      <span className="absolute inset-x-0 bottom-0 p-5 text-hero-foreground">
        <span className="text-lg font-light uppercase tracking-tight">{label}</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { open: openEnquiry } = useEnquiry();
  // trailingSlash: true makes paths look like "/katalogai/" — normalize to "/katalogai".
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [mobileGroup, setMobileGroup] = useState<Panel | null>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMenu(false);
    setPanel(null);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
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
      setPanel(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const light = isHome && !scrolled && !menu && !panel;

  const activePageKey =
    pathname.startsWith("/vidaus-durys") || pathname.startsWith("/lauko-durys")
      ? "products"
      : pathname === "/katalogai"
        ? "catalogues"
        : pathname.startsWith("/atlikti-darbai")
          ? "works"
          : pathname.startsWith("/kontaktai")
            ? "contact"
            : null;

  // Pabraukimas rodo tik atidarytą meniu arba esamą puslapį — ne užvedimą pele.
  const activeKey = panel ?? activePageKey;

  const measure = useCallback(() => {
    const header = headerRef.current;
    const el = activeKey ? itemRefs.current.get(activeKey) : undefined;
    if (!header || !el) {
      setMarker(null);
      return;
    }
    const hr = header.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setMarker({ left: r.left - hr.left, width: r.width });
  }, [activeKey]);

  useLayoutEffect(() => {
    measure();
  }, [measure, light]);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive) measure();
    };
    window.addEventListener("resize", run);
    window.addEventListener("load", run);
    document.fonts.ready.then(run).catch(() => {});
    return () => {
      alive = false;
      window.removeEventListener("resize", run);
      window.removeEventListener("load", run);
    };
  }, [measure]);

  const navItem = (key: string, label: string, to: string, which?: Panel) => (
    <Link
      href={to}
      ref={(node) => {
        if (node) itemRefs.current.set(key, node);
        else itemRefs.current.delete(key);
      }}
      aria-expanded={which ? panel === which : undefined}
      onClick={(e) => {
        if (!which) {
          setPanel(null);
          return;
        }
        e.preventDefault();
        setPanel((p) => (p === which ? null : which));
      }}
      className="inline-flex items-center py-7 text-[0.75rem] uppercase tracking-[0.14em]"
    >
      {label}
    </Link>
  );

  const mobileGroupToggle = (which: Panel, label: string) => (
    <button
      type="button"
      aria-expanded={mobileGroup === which}
      onClick={() => setMobileGroup((v) => (v === which ? null : which))}
      className="flex items-center justify-between py-3 text-left text-sm uppercase tracking-[0.14em]"
    >
      {label}
      <ChevronDown
        className={`size-3 transition-transform duration-200 ${mobileGroup === which ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        light ? "bg-transparent" : "bg-background"
      }`}
    >
      <div className="page-container flex h-20 items-center gap-8">
        <div className="mr-auto shrink-0">
          <Wordmark light={light} compact />
        </div>
        <nav
          className={`hidden items-center gap-7 text-[0.75rem] uppercase tracking-[0.14em] lg:flex ${light ? "text-hero-foreground" : "text-foreground"}`}
          aria-label="Pagrindinė navigacija"
        >
          {navItem("products", "Produktai", "/vidaus-durys", "products")}
          {navItem("catalogues", "Katalogai", "/katalogai", "catalogues")}
          {navItem("works", "Atlikti darbai", "/atlikti-darbai", "works")}
          {navItem("contact", "Kontaktai", "/kontaktai", "contact")}
        </nav>
        <Cta onClick={() => openEnquiry()} inverted={light} className="hidden lg:inline-flex">
          Gauti pasiūlymą
        </Cta>
        <button
          aria-label={menu ? "Uždaryti meniu" : "Atidaryti meniu"}
          className={`lg:hidden p-2 transition-opacity hover:opacity-60 ${light ? "text-hero-foreground" : "text-foreground"}`}
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        aria-hidden
        data-header-overlay
        className={`fixed inset-x-0 bottom-0 top-20 z-30 bg-foreground/30 transition-opacity duration-200 ${
          panel || menu ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {!light && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border">
          {marker && (
            <span
              className="absolute top-0 h-px bg-foreground transition-[left,width] duration-200 ease-out"
              style={{ left: `${marker.left}px`, width: `${marker.width}px` }}
            />
          )}
        </div>
      )}

      {panel === "products" && (
        <div className="mega-in absolute inset-x-0 top-full z-40 hidden bg-background lg:block">
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setPanel(null);
            }}
            className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
          >
            {/* Dvi nuotraukos dešinėje — tokio pat dydžio kaip „Atlikti darbai“ meniu. */}
            <div className="col-span-5 flex gap-16">
              <div>
                <PanelHeading>Produktai</PanelHeading>
                <div className="mt-6 flex flex-col gap-4">
                  {menuProductLinks.map((l) => (
                    <PanelLink key={l.label} href={l.to}>
                      {l.label}
                    </PanelLink>
                  ))}
                </div>
              </div>
              <div>
                <PanelHeading>Stiliai</PanelHeading>
                <div className="mt-6 flex flex-col gap-4">
                  {interiorCategories.map((c) => (
                    <PanelLink key={c} href={doorsCategoryHref(c)}>
                      {c}
                    </PanelLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-7 col-start-6 grid grid-cols-2 gap-3">
              {interiorCategories.slice(0, 2).map((c) => (
                <MenuPictureCard
                  key={c}
                  href={doorsCategoryHref(c)}
                  label={c}
                  ariaLabel={`Vidaus durys — ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {panel === "catalogues" && (
        <div className="mega-in absolute inset-x-0 top-full z-40 hidden bg-background lg:block">
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setPanel(null);
            }}
            className="page-container pb-14 pt-12"
          >
            <PanelHeading>Katalogai</PanelHeading>
            <div className="mt-6 flex flex-col gap-4">
              {catalogueLinks.map((l) => (
                <PanelLink key={l.to} href={l.to}>
                  {l.label}
                </PanelLink>
              ))}
            </div>
          </div>
        </div>
      )}

      {panel === "works" && (
        <div className="mega-in absolute inset-x-0 top-full z-40 hidden bg-background lg:block">
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setPanel(null);
            }}
            className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
          >
            <div className="col-span-5">
              <PanelHeading>Darbai</PanelHeading>
              <div className="mt-6 flex flex-col gap-4">
                <PanelLink href="/atlikti-darbai">Visi darbai</PanelLink>
                {projectCategories.map((c) => (
                  <PanelLink key={c} href={worksCategoryHref(c)}>
                    {c}
                  </PanelLink>
                ))}
              </div>
            </div>
            <div className="col-span-7 col-start-6 grid grid-cols-2 gap-3">
              {(["Vidaus durys", "Lauko durys"] as const).map((c) => (
                <MenuPictureCard
                  key={c}
                  href={worksCategoryHref(c)}
                  label={c}
                  ariaLabel={`Atlikti darbai — ${c}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {panel === "contact" && (
        <div className="mega-in absolute inset-x-0 top-full z-40 hidden bg-background lg:block">
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setPanel(null);
            }}
            className="page-container pb-14 pt-12"
          >
            <div>
              <PanelHeading>Kontaktai</PanelHeading>
              <div className="mt-6 flex flex-col gap-4">
                {contactLinks.map((l) => (
                  <PanelLink key={l.to} href={l.to}>
                    {l.label}
                  </PanelLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {menu && (
        <div className="relative z-40 h-[calc(100svh-5rem)] overflow-y-auto bg-background px-5 pb-8 pt-2 lg:hidden">
          <nav
            className="flex flex-col"
            aria-label="Mobilioji navigacija"
            onClick={(e) => {
              // Uždaro meniu ir tada, kai nuoroda veda į tą patį puslapį (pvz. /katalogai#…).
              if ((e.target as HTMLElement).closest("a")) setMenu(false);
            }}
          >
            {mobileGroupToggle("products", "Produktai")}
            {mobileGroup === "products" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                {menuProductLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.to}
                    className="py-3 text-sm uppercase text-foreground/80"
                  >
                    {l.label}
                  </Link>
                ))}
                <p className="pt-3 pb-1 text-xs uppercase tracking-[0.14em] text-foreground/65">
                  Stiliai
                </p>
                {interiorCategories.map((c) => (
                  <Link
                    key={c}
                    href={doorsCategoryHref(c)}
                    className="py-3 text-sm uppercase text-foreground/80"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            )}
            {mobileGroupToggle("catalogues", "Katalogai")}
            {mobileGroup === "catalogues" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                {catalogueLinks.map((l) => (
                  <Link
                    key={l.to}
                    href={l.to}
                    className="py-3 text-sm uppercase text-foreground/80"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            {mobileGroupToggle("works", "Atlikti darbai")}
            {mobileGroup === "works" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                <Link href="/atlikti-darbai" className="py-3 text-sm uppercase text-foreground/80">
                  Visi darbai
                </Link>
                {projectCategories.map((c) => (
                  <Link
                    key={c}
                    href={worksCategoryHref(c)}
                    className="py-3 text-sm uppercase text-foreground/80"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            )}
            {mobileGroupToggle("contact", "Kontaktai")}
            {mobileGroup === "contact" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                {contactLinks.map((l) => (
                  <Link
                    key={l.to}
                    href={l.to}
                    className="py-3 text-sm uppercase text-foreground/80"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
            <Cta
              onClick={() => {
                setMenu(false);
                openEnquiry();
              }}
              className="mt-8 w-full"
            >
              Gauti pasiūlymą
            </Cta>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-hero py-20 text-hero-foreground">
      <div className="page-container grid gap-y-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <Wordmark light />
          <p className="mt-8 max-w-xs text-sm font-light leading-6 text-hero-foreground/70">
            Vidaus ir lauko durys. Konsultacija, matavimas ir montavimas Kaune.
          </p>
        </div>
        <div className="grid content-start gap-4 text-sm font-light md:col-span-4 md:col-start-6">
          <p className="text-xs uppercase tracking-[0.2em] text-hero-foreground/60">Navigacija</p>
          {[...productLinks, katalogaiLink, ...otherLinks, ...contactLinks].map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="text-hero-foreground/70 transition-opacity hover:opacity-60"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="grid content-start gap-4 md:col-span-3 md:col-start-10">
          <p className="text-xs uppercase tracking-[0.2em] text-hero-foreground/60">Kontaktai</p>
          <a
            href={contactHref.address}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm font-light text-hero-foreground/70 transition-opacity hover:opacity-60"
          >
            {contact.address}
          </a>
          <a
            href={contactHref.phone}
            className="block text-sm font-light text-hero-foreground/70 transition-opacity hover:opacity-60"
          >
            {contact.phone}
          </a>
          <a
            href={contactHref.email}
            className="block text-sm font-light text-hero-foreground/70 transition-opacity hover:opacity-60"
          >
            {contact.email}
          </a>
          <p className="text-sm font-light text-hero-foreground/70">{contact.hours}</p>
        </div>
      </div>
      <div className="page-container mt-16 pt-6 text-xs uppercase tracking-[0.2em] text-hero-foreground/60">
        © {new Date().getFullYear()} Vilsema
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
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 ${
        inverted
          ? "bg-hero-foreground text-hero focus-visible:outline-hero-foreground"
          : "bg-primary text-primary-foreground focus-visible:outline-foreground"
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

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="page-container pb-16 pt-36 sm:pb-20 sm:pt-48">
      <ScrollReveal>
        <h1 className="max-w-3xl text-3xl font-light uppercase leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 max-w-xl text-base font-light leading-7 text-foreground/50">{intro}</p>
        )}
      </ScrollReveal>
    </header>
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
