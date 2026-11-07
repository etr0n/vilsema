"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type StripStatus = {
  scrollable: boolean;
  atStart: boolean;
  atEnd: boolean;
  left: number;
  width: number;
};

const EMPTY: StripStatus = { scrollable: false, atStart: true, atEnd: false, left: 0, width: 100 };

const same = (a: StripStatus, b: StripStatus) =>
  a.scrollable === b.scrollable &&
  a.atStart === b.atStart &&
  a.atEnd === b.atEnd &&
  Math.abs(a.left - b.left) < 0.2 &&
  Math.abs(a.width - b.width) < 0.2;

// Shared logic for full-bleed horizontal strips: edge state, progress and one-item steps.
export function useStripScroll<T extends HTMLElement>(itemSelector: string) {
  const ref = useRef<T>(null);
  const [status, setStatus] = useState<StripStatus>(EMPTY);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // scroll-padding percentages resolve against the scroller, not the container, so mirror the bleed padding in px.
    const pad = getComputedStyle(el).paddingLeft;
    if (el.style.scrollPaddingInline !== pad) el.style.scrollPaddingInline = pad;
    const max = el.scrollWidth - el.clientWidth;
    const scrollable = max > 4;
    const width = el.scrollWidth > 0 ? Math.min(100, (el.clientWidth / el.scrollWidth) * 100) : 100;
    const progress = max > 0 ? Math.min(Math.max(el.scrollLeft / max, 0), 1) : 0;
    const next: StripStatus = {
      scrollable,
      atStart: el.scrollLeft <= 2,
      atEnd: scrollable ? el.scrollLeft >= max - 2 : true,
      width,
      left: progress * (100 - width),
    };
    setStatus((prev) => (same(prev, next) ? prev : next));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const ro = new ResizeObserver(() => measure());
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = el.querySelector<HTMLElement>(itemSelector);
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  return { ref, status, nudge };
}

const arrowClass =
  "flex size-11 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-60 disabled:cursor-default disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-foreground";

export function StripArrows({
  status,
  nudge,
  prevLabel,
  nextLabel,
}: {
  status: StripStatus;
  nudge: (dir: 1 | -1) => void;
  prevLabel: string;
  nextLabel: string;
}) {
  if (!status.scrollable) return null;
  return (
    <div className="-mr-2 flex gap-1">
      <button type="button" onClick={() => nudge(-1)} disabled={status.atStart} aria-label={prevLabel} className={arrowClass}>
        <ChevronLeft className="size-9" strokeWidth={2.25} />
      </button>
      <button type="button" onClick={() => nudge(1)} disabled={status.atEnd} aria-label={nextLabel} className={arrowClass}>
        <ChevronRight className="size-9" strokeWidth={2.25} />
      </button>
    </div>
  );
}
