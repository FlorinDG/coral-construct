"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Drag (or arrow-key) comparison of a wall before and after. Without photos it
 * draws placeholder walls, so the layout is final before the images exist.
 */
export function BeforeAfter({ before, after, caption }: { before: string | null; after: string | null; caption: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const fromPointer = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <figure className="ba">
      <div
        ref={box}
        className="ba-frame"
        style={{ "--pos": `${pos}%` } as React.CSSProperties}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e.clientX);
        }}
      >
        <div className="ba-layer ba-before">{before && <Image src={before} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />}</div>
        <div className="ba-layer ba-after">{after && <Image src={after} alt="" fill sizes="(max-width: 900px) 100vw, 60vw" />}</div>
        <span className="ba-tag ba-tag-before">^Before</span>
        <span className="ba-tag ba-tag-after">^After</span>
        <span className="ba-handle" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="^Compare before and after"
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
