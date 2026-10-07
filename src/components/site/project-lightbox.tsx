"use client";

import { useEffect, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { projectImage, type Project } from "@/lib/site-data";
import { asset } from "@/lib/utils";

const roundButton =
  "flex size-12 items-center justify-center rounded-full bg-hero text-hero-foreground transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hero";

export function ProjectLightbox({
  projects,
  index,
  onIndexChange,
  onClose,
}: {
  projects: Project[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const open = index !== null && projects.length > 0;
  const current = open ? projects[index] : undefined;
  const touchX = useRef<number | null>(null);
  const count = projects.length;

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onIndexChange((index + dir + count) % count);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-background outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:inset-4"
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            const end = e.changedTouches[0]?.clientX;
            touchX.current = null;
            if (start == null || end == null || Math.abs(end - start) < 50) return;
            go(end < start ? 1 : -1);
          }}
        >
          {current && (
            <>
              <DialogPrimitive.Title className="sr-only">{current.caption}</DialogPrimitive.Title>
              <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4 pb-8 pt-20 sm:px-24 sm:pt-8">
                <img
                  key={current.id}
                  src={asset(projectImage(current, "lg"))}
                  alt={current.alt}
                  className="min-h-0 max-w-full flex-1 object-contain"
                />
                <figcaption className="max-w-2xl text-center text-base font-light text-foreground/70">
                  {current.description}
                </figcaption>
              </figure>

              <DialogPrimitive.Close
                aria-label="Uždaryti"
                className={`${roundButton} absolute right-4 top-4 sm:right-8 sm:top-6`}
              >
                <X className="size-4" strokeWidth={1.5} />
              </DialogPrimitive.Close>
              {count > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Ankstesnis darbas"
                    className={`${roundButton} absolute left-4 top-1/2 -translate-y-1/2 sm:left-6`}
                  >
                    <ChevronLeft className="size-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Kitas darbas"
                    className={`${roundButton} absolute right-4 top-1/2 -translate-y-1/2 sm:right-6`}
                  >
                    <ChevronRight className="size-4" strokeWidth={1.5} />
                  </button>
                </>
              )}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
