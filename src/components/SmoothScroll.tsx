"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useState } from "react";
import "lenis/dist/lenis.css";

/** Lenis on the page root; skipped entirely for prefers-reduced-motion. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: { offset: 0 } }}>
      {children}
    </ReactLenis>
  );
}

/**
 * Marks each [data-section] with `is-in` when it enters the viewport, which
 * the variant stylesheets use to play the section's entrance.
 */
export function useSectionReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-section]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("is-in");
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Smooth-scroll to a selector through Lenis, falling back to native smooth scroll. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string) => {
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };
}
