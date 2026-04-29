"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Slide } from "@/lib/demo-slides";

type Props = {
  slides: Slide[];
  /** Si es true, ocupa toda la altura del viewport (vista standalone) */
  fullViewport?: boolean;
};

export function SlideDeck({ slides, fullViewport = false }: Props) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIndex(clamped);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, total]);

  const slide = slides[index];

  return (
    <div
      className={`flex w-full flex-col bg-background ${
        fullViewport ? "h-screen" : "min-h-[80vh]"
      }`}
    >
      {/* Header: progreso */}
      <div className="border-b px-8 py-3 flex items-center gap-4">
        <div className="text-xs font-mono text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <div className="flex-1 flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Ir a slide ${i + 1}`}
              className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer hover:bg-primary/70 ${
                i === index
                  ? "bg-primary"
                  : i < index
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body: slide actual con animación */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 px-8 md:px-16 lg:px-24 py-10 md:py-14"
          >
            <div className="mx-auto h-full max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
              {/* Columna texto (3/5) */}
              <div className="md:col-span-3 flex flex-col justify-center gap-5">
                {slide.eyebrow && (
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {slide.eyebrow}
                  </div>
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] text-foreground">
                  {slide.title}
                </h2>
                {slide.body && <div className="mt-2">{slide.body}</div>}
              </div>

              {/* Columna visual (2/5) */}
              <div className="md:col-span-2 flex items-center justify-center min-h-[200px] md:min-h-0">
                <div className="w-full h-full max-h-[520px] flex items-center justify-center">
                  {slide.visual}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer: navegación */}
      <div className="border-t px-8 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={index === 0}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <div className="hidden md:block text-xs text-muted-foreground">
          ← → para navegar · Espacio para avanzar
        </div>
        <Button
          variant="default"
          onClick={next}
          disabled={index === total - 1}
          className="cursor-pointer"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
