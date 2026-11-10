// Every "^..." string is placeholder copy to be defined.

export const CONTACT = {
  company: "Coral Construct",
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
  eyebrow: "^General contractor · Belgium",
  title: ["^Build it once.", "^Build it right."],
  lead: "^One team from plan to keys — new builds, renovations and extensions.",
  quickStartLabel: "^Start your free quote — what are you planning?",
};

export const SERVICES = {
  eyebrow: "^What we do",
  title: "^One contractor, the whole job",
  items: [
    { key: "newbuild", title: "^New build", text: "^Turn-key homes from foundation to finish." },
    { key: "renovation", title: "^Renovation", text: "^Kitchens, bathrooms, roofs, whole houses." },
    { key: "extension", title: "^Extension", text: "^More space without moving out." },
    { key: "energy", title: "^Energy upgrade", text: "^Insulation and facades that pay back." },
  ],
};

export const PROOF = {
  eyebrow: "^Why Coral",
  title: "^Numbers we stand behind",
  stats: [
    { value: "^250+", label: "^Projects delivered" },
    { value: "^15", label: "^Years on site" },
    { value: "^98%", label: "^On-time handover" },
    { value: "^10y", label: "^Structural warranty" },
  ],
  quote: { text: "^They did what they promised, when they promised it.", who: "^Client name, City" },
};

export const PROCESS = {
  eyebrow: "^How it works",
  title: "^From first call to keys",
  steps: [
    { title: "^Call or form", text: "^Tell us what you plan — two minutes." },
    { title: "^Site visit", text: "^We come by, measure and listen." },
    { title: "^Fixed quote", text: "^Clear price, clear planning." },
    { title: "^Build", text: "^One site lead, weekly updates." },
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
