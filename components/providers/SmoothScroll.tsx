"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Desktop wheel smoothing only. Touch / reduced-motion use native scroll so
 * Framer Motion useScroll and sticky headers stay in sync.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.7,
      smoothWheel: true,
      syncTouch: false,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
