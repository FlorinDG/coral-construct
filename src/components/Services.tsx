"use client";

import Image from "next/image";
import { useState } from "react";
import type { Service } from "@/content/site";
import { useLeadForm } from "./form/LeadFormProvider";
import { useScrollTo } from "./SmoothScroll";

/**
 * Expanding service panels (after coral-group.be "Our Expertise"): one panel
 * open at a time, the others narrow with a vertical title. Hover, tap or focus
 * opens a panel; its button starts the quote with that service picked.
 * On narrow screens the panels stack and open vertically.
 */
export function Services({ items }: { items: Service[] }) {
  const [active, setActive] = useState(0);
  const { start } = useLeadForm();
  const scrollTo = useScrollTo();

  return (
    <div className="svc-row">
      {items.map((s, i) => {
        const open = i === active;
        return (
          <article
            key={s.key}
            className="svc"
            data-open={open || undefined}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            style={{ "--i": i } as React.CSSProperties}
          >
            <div className={`svc-art svc-art-${i + 1}`} aria-hidden>
              {s.image && <Image src={s.image} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />}
            </div>
            <div className="svc-shade" aria-hidden />
            <h3 className="svc-title">
              <button
                type="button"
                className="svc-toggle"
                aria-expanded={open}
                aria-controls={`svc-${s.key}`}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {s.title}
              </button>
            </h3>
            <div className="svc-body" id={`svc-${s.key}`} hidden={!open}>
              <p className="svc-tagline">{s.tagline}</p>
              <p className="svc-text">{s.text}</p>
              <button
                type="button"
                className="btn btn-primary svc-cta"
                aria-label={`^Get a quote: ${s.title}`}
                onClick={() => {
                  start(s.key);
                  scrollTo("#contact");
                }}
              >
                ^Get a quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
