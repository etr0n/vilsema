"use client";

import { useEffect, useRef } from "react";

// The photo is taller than its frame and drifts slower than the page while the frame is on screen.
// OVERSCAN is how far (as a share of the frame height) it can move each way.
const OVERSCAN = 0.35;

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  mediaClassName = "",
  priority = false,
  focusY,
  focusAt = 0.5,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  mediaClassName?: string;
  priority?: boolean;
  // Keeps one point of the photo (focusY: 0 = top, 1 = bottom) at the same height in the frame
  // (focusAt: share of the frame height) on every screen size, e.g. a door handle under the text.
  focusY?: number;
  focusAt?: number;
  children?: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img || focusY === undefined) return;

    const place = () => {
      if (!img.naturalWidth) return;
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      const boxH = h * (1 + OVERSCAN * 2);
      const renderedH = (w * img.naturalHeight) / img.naturalWidth;
      // Taller than the box: object-cover crops top/bottom, so we can choose which band shows.
      if (renderedH <= boxH) {
        img.style.objectPosition = "";
        return;
      }
      const cut = focusY * renderedH - OVERSCAN * h - focusAt * h;
      const clamped = Math.min(Math.max(cut, 0), renderedH - boxH);
      img.style.objectPosition = `50% ${-clamped.toFixed(1)}px`;
    };

    place();
    img.addEventListener("load", place);
    window.addEventListener("resize", place);
    return () => {
      img.removeEventListener("load", place);
      window.removeEventListener("resize", place);
    };
  }, [focusY, focusAt]);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      // 0 when the frame enters at the bottom, 1 when it leaves at the top.
      const progress = (vh - rect.top) / (vh + rect.height);
      const shift = (progress - 0.5) * 2 * OVERSCAN * rect.height;
      img.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      {/* A load animation (e.g. a zoom) runs on this layer so it doesn't fight the parallax transform */}
      <div className={`absolute inset-0 ${mediaClassName}`}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : undefined}
          style={{ top: `${-OVERSCAN * 100}%`, height: `${100 + OVERSCAN * 200}%` }}
          className={`absolute inset-x-0 w-full object-cover will-change-transform ${imgClassName}`}
        />
      </div>
      {children}
    </div>
  );
}
