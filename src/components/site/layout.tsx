"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEnquiry } from "@/components/site/enquiry";
import { Logo } from "@/components/site/logo";
import { ScrollReveal } from "@/components/site/scroll-reveal";
import {
  company,
  contact,
  contactHref,
  interiorCategories,
  photos,
  projectCategories,
} from "@/lib/site-data";
import { asset } from "@/lib/utils";

const doorsCategoryHref = (c: string) => `/vidaus-durys?kategorija=${encodeURIComponent(c)}`;
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

const menuProductLinks = [{ label: "Visos durys", to: "/vidaus-durys" }, ...productLinks] as const;

const katalogaiLink = { label: "Katalogai", to: "/katalogai" } as const;

const menuCategoryPhotos: Partial<Record<string, string>> = {
  Klasikinės: "/images/projektai/vidaus-durys-01-lg.webp",
  Modernios: "/images/projektai/vidaus-durys-pasleptos-01-lg.webp",
};

const contactLinks = [
  { label: "Kontaktai", to: "/kontaktai" },
  { label: "DUK", to: "/duk" },
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
      className={light ? "text-header-logo lg:transition-colors lg:duration-300 lg:ease-in-out lg:[transition-delay:var(--menu-close-delay,0ms)]" : "text-foreground"}
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
      className="w-fit text-2xl font-normal leading-snug text-mega-menu-text transition-opacity duration-300 hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mega-menu-text"
    >
      {children}
    </Link>
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
  onLinkClick,
  className,
  children,
}: {
  open: boolean;
  onLinkClick: () => void;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-x-0 top-full z-40 hidden bg-mega-menu text-mega-menu-text transition-[opacity,visibility] duration-300 ease-in-out lg:block ${open ? "visible opacity-100" : "invisible pointer-events-none opacity-0 [transition-delay:var(--panel-close-delay,0ms)]"
        }`}
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
  // Following a link closes the menu without fading, so it doesn't linger over the next page.
  const [closeInstantly, setCloseInstantly] = useState(false);
  const closeForNavigation = () => {
    setCloseInstantly(true);
    setPanel(null);
    setMenu(false);
  };
  const [mobileGroup, setMobileGroup] = useState<Panel | null>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    setMenu(false);
    setPanel(null);
    setMobileGroup(null);
    setCloseInstantly(false);
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

  const activePageKey =
    pathname.startsWith("/vidaus-durys") || pathname.startsWith("/lauko-durys")
      ? "products"
      : pathname === "/katalogai"
        ? "catalogues"
        : pathname.startsWith("/atlikti-darbai")
          ? "works"
          : pathname.startsWith("/apie-mus")
            ? "about"
            : pathname.startsWith("/duk")
              ? "duk"
              : pathname.startsWith("/kontaktai")
                ? "contact"
                : null;

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
  }, [measure]);

  useEffect(() => {
    let alive = true;
    const run = () => {
      if (alive) measure();
    };
    window.addEventListener("resize", run);
    window.addEventListener("load", run);
    document.fonts.ready.then(run).catch(() => { });
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
          closeForNavigation();
          return;
        }
        e.preventDefault();
        setCloseInstantly(false);
        setPanel((p) => (p === which ? null : which));
      }}
      className="inline-flex items-center py-7 text-sm font-medium uppercase tracking-[0.14em]"
    >
      {label}
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
        className={`size-5 transition-transform duration-200 ${mobileGroup === which ? "rotate-180" : ""}`}
      />
    </button>
  );

  const open = panel !== null || menu;

  return (
    <header
      ref={headerRef}
      // The overlay fades in only after the panel is opaque and fades out before it, so it never
      // darkens behind a half-transparent panel (which shows as an edge under the bar).
      className={`fixed inset-x-0 top-0 z-40 bg-header [--panel-close-delay:200ms] ${open ? "[--header-text:var(--mega-menu-text)] [--header-logo:var(--mega-menu-logo)]" : "[--menu-close-delay:200ms]"} ${closeInstantly && !open ? "[&_*]:transition-none!" : ""}`}
    >
      {/* Fades in with the same opacity transition as the mega menu, so bar and panel read as one surface */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-mega-menu lg:transition-opacity lg:duration-300 lg:ease-in-out lg:[transition-delay:var(--menu-close-delay,0ms)] ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div className="page-container relative flex h-20 items-center justify-between gap-8">
        <div className="shrink-0">
          <Wordmark light compact />
        </div>
        <nav
          className="hidden items-center gap-7 text-sm font-medium uppercase tracking-[0.14em] text-header-text lg:flex lg:transition-colors lg:duration-300 lg:ease-in-out lg:[transition-delay:var(--menu-close-delay,0ms)]"
          aria-label="Pagrindinė navigacija"
        >
          {navItem("products", "Produktai", "/vidaus-durys", "products")}
          {navItem("works", "Atlikti darbai", "/atlikti-darbai", "works")}
          {navItem("catalogues", "Katalogai", "/katalogai")}
          {navItem("about", "Apie mus", "/apie-mus")}
          {navItem("duk", "DUK", "/duk")}
          {navItem("contact", "Kontaktai", "/kontaktai")}
        </nav>
        <button
          aria-label={menu ? "Uždaryti meniu" : "Atidaryti meniu"}
          className="lg:hidden p-2 text-header-text transition-opacity hover:opacity-60"
          onClick={() => {
            setCloseInstantly(false);
            setMenu((v) => !v);
          }}
        >
          {menu ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        aria-hidden
        data-header-overlay
        className={`fixed inset-x-0 bottom-0 top-20 z-30 bg-foreground/30 transition-opacity ease-in-out ${open ? "delay-300 duration-300 opacity-100" : "pointer-events-none opacity-0 duration-200"
          }`}
      />

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-3 h-px">
        {marker && (
          <span
            className="absolute top-0 h-px bg-header-text [transition:left_200ms_ease-out,width_200ms_ease-out,background-color_300ms_ease-in-out]"
            style={{ left: `${marker.left}px`, width: `${marker.width}px` }}
          />
        )}
      </div>

      <MegaPanel
        open={panel === "products"}
        onLinkClick={closeForNavigation}
        className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
      >
        <div className="col-span-5 flex gap-16">
          <div>
            <div className="flex flex-col gap-3">
              {menuProductLinks.map((l) => (
                <PanelLink key={l.label} href={l.to}>
                  {l.label}
                </PanelLink>
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-3">
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
              src={menuCategoryPhotos[c] ?? photos.interior}
            />
          ))}
        </div>
      </MegaPanel>


      <MegaPanel
        open={panel === "works"}
        onLinkClick={closeForNavigation}
        className="page-container grid grid-cols-12 gap-x-6 pb-14 pt-12"
      >
        <div className="col-span-5">
          <div className="flex flex-col gap-3">
            <PanelLink href="/atlikti-darbai">Visi darbai</PanelLink>
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
            imgClassName="aspect-[774/381]"
            className="col-span-2"
          />
        </div>
      </MegaPanel>

      {menu && (
        <div className="relative z-40 h-[calc(100svh-5rem)] overflow-y-auto bg-mega-menu px-5 pb-8 pt-2 text-mega-menu-text lg:hidden">
          <nav
            className="flex flex-col"
            aria-label="Mobilioji navigacija"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) closeForNavigation();
            }}
          >
            {mobileGroupToggle("products", "Produktai")}
            {mobileGroup === "products" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                {menuProductLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.to}
                    className="py-2 text-2xl font-normal"
                  >
                    {l.label}
                  </Link>
                ))}
                <p className="pb-1 pt-4 text-sm font-medium uppercase tracking-[0.14em]">
                  Stiliai
                </p>
                {interiorCategories.map((c) => (
                  <Link
                    key={c}
                    href={doorsCategoryHref(c)}
                    className="py-2 text-2xl font-normal"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            )}
            {mobileGroupToggle("works", "Atlikti darbai")}
            {mobileGroup === "works" && (
              <div className="mega-in flex flex-col pb-2 pl-4">
                <Link href="/atlikti-darbai" className="py-2 text-2xl font-normal">
                  Visi darbai
                </Link>
                {projectCategories.map((c) => (
                  <Link
                    key={c}
                    href={worksCategoryHref(c)}
                    className="py-2 text-2xl font-normal"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/katalogai" className="py-3 text-2xl font-normal">
              Katalogai
            </Link>
            <Link href="/apie-mus" className="py-3 text-2xl font-normal">
              Apie mus
            </Link>
            <Link href="/duk" className="py-3 text-2xl font-normal">
              DUK
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

export function Footer() {
  return (
    <footer className="bg-background py-20 text-foreground">
      <div className="page-container grid gap-y-16 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-5">
          <Wordmark light={false} logoClassName="h-8.25" />
          <p className="mt-8 max-w-md text-2xl font-normal leading-snug text-foreground/80">
            Vidaus ir lauko durys. Konsultacija, matavimas ir montavimas Kaune.
          </p>
          <div className="mt-6 text-base leading-7 text-foreground/80">
            <p>{company.legalName}</p>
            <p>Įmonės kodas: {company.code}</p>
          </div>
        </div>
        <div className="grid content-start gap-3 text-2xl font-normal leading-snug md:col-span-4 md:col-start-6">
          <p className="mb-1 text-sm uppercase tracking-[0.14em] text-foreground/75">Navigacija</p>
          {[...productLinks, katalogaiLink, ...otherLinks, ...contactLinks].map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="text-foreground/80 transition-opacity hover:opacity-60"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="grid content-start gap-3 text-2xl font-normal leading-snug md:col-span-3 md:col-start-10">
          <p className="mb-1 text-sm uppercase tracking-[0.14em] text-foreground/75">Kontaktai</p>
          <a
            href={contactHref.address}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-foreground/80 transition-opacity hover:opacity-60"
          >
            {contact.address}
          </a>
          <a
            href={contactHref.phone}
            className="block text-foreground/80 transition-opacity hover:opacity-60"
          >
            {contact.phone}
          </a>
          <a
            href={contactHref.email}
            className="block text-foreground/80 transition-opacity hover:opacity-60"
          >
            {contact.email}
          </a>
          <p className="text-foreground/80">{contact.hours}</p>
        </div>
      </div>
      <div className="page-container mt-16 pt-6 text-sm uppercase tracking-[0.14em] text-foreground/75">
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
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 uppercase border transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 ${inverted
        ? "border-hero-foreground bg-transparent px-6 text-sm tracking-[0.14em] text-hero-foreground hover:bg-hero-foreground hover:text-menu focus-visible:outline-hero-foreground"
        : "border-[#E35336] bg-[#E35336] px-9 text-[11px] tracking-[0.18em] text-primary-foreground hover:border-[#64563A] hover:bg-[#64563A] hover:text-white focus-visible:outline-foreground"
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
    <div className="bg-page-hero pb-56 [&+*]:-mt-56 [&+*:has([data-empty])]:bg-page-hero [&+*:has([data-empty])]:[box-shadow:0_0_0_100vmax_var(--page-hero-color)] [&+*:has([data-empty])]:[clip-path:inset(0_-100vmax)]">
      <header className="page-container pb-16 pt-36 sm:pb-20 sm:pt-48">
        <ScrollReveal>
          <h1 className="max-w-3xl text-page-hero-text text-3xl font-light uppercase leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-8 max-w-xl text-lg leading-7 text-page-hero-text">{intro}</p>
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
          <h1 className="max-w-3xl text-3xl font-light uppercase leading-tight tracking-tight text-page-hero-text sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-8 max-w-xl text-lg leading-7 text-page-hero-text">{intro}</p>}
        </ScrollReveal>
      </header>
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 bg-background lg:left-[max(0px,calc((100%-var(--container-page))/2-6.5rem))]"
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
