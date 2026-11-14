// Every "^..." string is placeholder copy to be defined.

export const CONTACT = {
  company: "Coral Atelier",
  phone: "^+32 000 00 00 00",
  phoneHref: "tel:+32000000000",
  whatsappHref: "https://wa.me/32000000000",
  email: "^info@example.be",
  emailHref: "mailto:info@example.be",
  address: ["^Street 1", "^1000 City"],
  hours: "^Mon–Fri 8:00–18:00",
  /** Drives the "open now" status; days 1 = Monday … 7 = Sunday, Belgian time. */
  openingHours: { timeZone: "Europe/Brussels", days: [1, 2, 3, 4, 5], open: "08:00", close: "18:00" },
  vat: "^BE 0000.000.000",
  copyrightYear: 2026,
  responsePromise: "^Answer within 1 working day",
};

export const HERO = {
  eyebrow: "^Painting & decoration · Belgium",
  title: ["^Finish it once.", "^Finish it right."],
  lead: "^Paint, plastering, wallpaper and custom decoration — inside and out.",
  quickStartLabel: "^Start your free quote — what are you planning?",
};

export type Service = { key: string; title: string; tagline: string; text: string; image: string | null };

export const SERVICES: { eyebrow: string; title: string; items: Service[] } = {
  eyebrow: "^What we do",
  title: "^Every finish, one team",
  items: [
    // `key` is the form's project type: the panel button starts the quote with it.
    // `image`: photo path once available; until then each panel draws its finish.
    { key: "paint", title: "^Paint", tagline: "^Colour, done properly", text: "^Walls, ceilings, woodwork — interior and exterior.", image: null },
    { key: "plastering", title: "^Plastering", tagline: "^Smooth from the first coat", text: "^Walls and ceilings, base coat to skim, ready for paint.", image: null },
    { key: "wallpaper", title: "^Wallpapers", tagline: "^Pattern, perfectly aligned", text: "^Hung straight, seams invisible.", image: null },
    { key: "custom", title: "^Custom decorations", tagline: "^One of a kind", text: "^Feature walls, effects and one-off finishes.", image: null },
  ],
};

/** The hero colour fan: the house palette as paint chips. */
export const SWATCHES = [
  { name: "^Lagoon", hex: "#339989" },
  { name: "^Moss", hex: "#344B46" },
  { name: "^Sage", hex: "#97B1AB" },
  { name: "^Linen", hex: "#F3EADA" },
  { name: "^Plum", hex: "#734978" },
  { name: "^Ochre", hex: "#9A8A3A" },
  { name: "^Coral", hex: "#FF8559" },
];

export const PROOF = {
  eyebrow: "^Why Coral",
  title: "^See the difference",
  stats: [
    { value: "^250+", label: "^Projects delivered" },
    { value: "^15", label: "^Years on site" },
    { value: "^98%", label: "^On-time delivery" },
    { value: "^10y", label: "^Finish warranty" },
  ],
  quote: { text: "^They did what they promised, when they promised it.", who: "^Client name, City" },
  points: ["^Floors and furniture covered", "^Site cleaned every evening", "^Colour advice included"],
  /** Photos go here later; without them the slider shows drawn placeholders. */
  beforeAfter: {
    before: null as string | null,
    after: null as string | null,
    caption: "^Living room, City — two coats, one day",
  },
};

export const PROCESS = {
  eyebrow: "^How it works",
  title: "^From first call to last coat",
  steps: [
    { title: "^Call or form", text: "^Tell us what you plan — two minutes." },
    { title: "^Site visit", text: "^We come by, measure and listen." },
    { title: "^Fixed quote", text: "^Clear price, clear planning." },
    { title: "^Prep, paint, finish", text: "^Covered, clean, on schedule." },
  ],
};

export const CONTACT_SECTION = {
  eyebrow: "^Free quote",
  title: "^Let's talk about your project",
  lead: "^Fill in the form, or skip it and call — whatever is faster for you.",
};

export const NAV = [
  { href: "#services", label: "^Services" },
  { href: "#proof", label: "^Why us" },
  { href: "#process", label: "^Process" },
  { href: "#contact", label: "^Contact" },
];
