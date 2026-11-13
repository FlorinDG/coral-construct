"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/content/site";

const DAY_NAMES = ["^Mon", "^Tue", "^Wed", "^Thu", "^Fri", "^Sat", "^Sun"];

type Status = { open: boolean; text: string };

/** Open / closed right now, by the office's own clock (not the visitor's). */
export function openStatus(now: Date, h = CONTACT.openingHours): Status {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: h.timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(parts.weekday) + 1;
  const time = `${parts.hour}:${parts.minute}`;

  if (h.days.includes(day) && time >= h.open && time < h.close) {
    return { open: true, text: `^Open now · until ${h.close}` };
  }
  // Next opening: later today, or the next working day.
  for (let i = 0; i < 7; i++) {
    const d = ((day - 1 + i) % 7) + 1;
    if (!h.days.includes(d) || (i === 0 && time >= h.open)) continue;
    const when = i === 0 ? "^today" : i === 1 ? "^tomorrow" : DAY_NAMES[d - 1];
    return { open: false, text: `^Closed · opens ${when} ${h.open}` };
  }
  return { open: false, text: "^Closed" };
}

/** Rendered after mount only, so the server-rendered HTML never shows a stale status. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(openStatus(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return <span className={`open-status ${className}`}>{CONTACT.hours}</span>;
  return (
    <span className={`open-status ${className}`} data-open={status.open}>
      <span className="dot" aria-hidden /> {status.text}
    </span>
  );
}
