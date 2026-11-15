/**
 * The Coral Atelier mark (15/11/2026): three paint chips — lagoon, plum, coral —
 * fanned 22° apart on one rivet, cool to the brand colour, coral on top.
 * This is the SMALL version (below ~48px: no label lines, no rivet), the one the
 * site's top bar and footer need. The cut between the chips takes the surface
 * colour (`--logo-cut`, default the variant's --surface) so the overlaps stay crisp.
 * Full set (mark, lockups, C icon) lives in /public/brand.
 */
export function Logo({ className }: { className?: string }) {
  const chip = (angle: number, fill: string) => (
    <g transform={`rotate(${angle})`}>
      <rect x="-17" y="-90" width="34" height="96" rx="6" fill={fill} stroke="var(--logo-cut, var(--surface))" strokeWidth="2.5" />
      <path d="M-17 -84a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v12h-34z" fill="var(--paper)" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 104 106" aria-hidden>
      <g transform="translate(52 92)">
        {chip(-22, "var(--primary)")}
        {chip(0, "var(--secondary)")}
        {chip(22, "var(--coral)")}
      </g>
    </svg>
  );
}
