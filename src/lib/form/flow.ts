import type { Step } from "./types";

// The lead form flow. Structure and branching are real; the wording is
// placeholder — every "^..." string is copy still to be defined.
//
// Rules of the flow:
//  - Start with one tap (project type), shown in the hero too.
//  - Only ask what the answer so far makes useful (`when`).
//  - Ask for contact details before the nice-to-haves, so a lead exists
//    even if the visitor stops there.

export const PROJECT_TYPES = [
  { value: "paint", label: "^Paint", hint: "^Walls, ceilings, woodwork" },
  { value: "plastering", label: "^Plastering", hint: "^Walls and ceilings" },
  { value: "wallpaper", label: "^Wallpapers", hint: "^One room or the whole house" },
  { value: "custom", label: "^Custom decorations", hint: "^Tell us in a sentence" },
];

const SIZE = [
  { value: "s", label: "^Under 30 m²" },
  { value: "m", label: "^30–100 m²" },
  { value: "l", label: "^Over 100 m²" },
  { value: "unknown", label: "^Not sure" },
];

export const FLOW: Step[] = [
  {
    id: "project",
    title: "^What can we do for you?",
    questions: [{ id: "project", kind: "choice", label: "^Type of work", required: true, options: PROJECT_TYPES }],
  },

  // ── Branch: one scope step per type of work ──────────────────────────
  {
    id: "scope-paint",
    title: "^About the paintwork",
    when: { q: "project", eq: "paint" },
    questions: [
      {
        id: "paintWhere",
        kind: "choice",
        label: "^Inside or outside?",
        short: "^Where",
        required: true,
        options: [
          { value: "interior", label: "^Interior" },
          { value: "exterior", label: "^Exterior" },
          { value: "both", label: "^Both" },
        ],
      },
      {
        id: "paintSurfaces",
        kind: "multi",
        label: "^What gets painted?",
        short: "^Surfaces",
        required: true,
        min: 1,
        when: { q: "paintWhere", in: ["interior", "both"] },
        options: [
          { value: "walls", label: "^Walls" },
          { value: "ceilings", label: "^Ceilings" },
          { value: "woodwork", label: "^Doors / woodwork" },
          { value: "stairs", label: "^Stairs" },
        ],
      },
      { id: "paintSize", kind: "choice", label: "^Approximate surface", short: "^Surface", options: SIZE },
    ],
  },
  {
    id: "scope-plastering",
    title: "^About the plastering",
    when: { q: "project", eq: "plastering" },
    questions: [
      {
        id: "plasterJob",
        kind: "choice",
        label: "^New plastering or repair?",
        short: "^Job",
        required: true,
        options: [
          { value: "new", label: "^New plastering" },
          { value: "repair", label: "^Repair / skim existing" },
        ],
      },
      { id: "plasterSize", kind: "choice", label: "^Approximate surface", short: "^Surface", options: SIZE },
    ],
  },
  {
    id: "scope-wallpaper",
    title: "^About the wallpaper",
    when: { q: "project", eq: "wallpaper" },
    questions: [
      {
        id: "wallpaperRooms",
        kind: "choice",
        label: "^How many rooms?",
        short: "^Rooms",
        required: true,
        options: [
          { value: "1", label: "^One room / one wall" },
          { value: "2-3", label: "^2–3 rooms" },
          { value: "4+", label: "^4 or more" },
        ],
      },
      {
        id: "wallpaperSupply",
        kind: "choice",
        label: "^Do you have the wallpaper?",
        short: "^Wallpaper",
        options: [
          { value: "have", label: "^Yes, I have it" },
          { value: "advice", label: "^No, I'd like advice" },
        ],
      },
    ],
  },
  {
    id: "scope-custom",
    title: "^Tell us briefly",
    when: { q: "project", eq: "custom" },
    questions: [
      { id: "customDescription", kind: "textarea", label: "^What do you have in mind?", short: "^Description", required: true, placeholder: "^A sentence or two" },
    ],
  },

  {
    // One tap; "advice" is the strongest signal for a site visit.
    id: "colours",
    title: "^Have you chosen colours?",
    questions: [
      {
        id: "colourChoice",
        kind: "choice",
        label: "^Colours",
        options: [
          { value: "chosen", label: "^Yes, I know what I want" },
          { value: "advice", label: "^I'd like colour advice" },
          { value: "same", label: "^Same as now" },
        ],
      },
    ],
  },

  // ── Common ───────────────────────────────────────────────────────────
  {
    id: "timing",
    title: "^When would you like to start?",
    questions: [
      {
        id: "timeline",
        kind: "choice",
        label: "^Start",
        required: true,
        options: [
          { value: "asap", label: "^As soon as possible" },
          { value: "3m", label: "^Within 3 months" },
          { value: "12m", label: "^3–12 months" },
          { value: "exploring", label: "^Just exploring" },
        ],
      },
    ],
  },
  {
    // Only asked when the visitor is actually planning, not browsing.
    id: "budget",
    title: "^Rough budget?",
    when: { not: { q: "timeline", eq: "exploring" } },
    questions: [
      {
        id: "budget",
        kind: "choice",
        label: "^Budget",
        options: [
          { value: "lt2", label: "^Under €2k" },
          { value: "2-5", label: "^€2k–5k" },
          { value: "5-15", label: "^€5k–15k" },
          { value: "gt15", label: "^Over €15k" },
          { value: "unknown", label: "^Rather not say" },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "^Where can we reach you?",
    lead: "^We answer within one working day.",
    requireOneOf: { ids: ["phone", "email"], message: "^Phone or email, at least one" },
    questions: [
      { id: "name", kind: "text", label: "^Name", required: true, autoComplete: "name", placeholder: "^Your name" },
      { id: "phone", kind: "tel", label: "^Phone", autoComplete: "tel", placeholder: "^+32 …" },
      { id: "email", kind: "email", label: "^Email", autoComplete: "email", placeholder: "^you@example.com" },
      { id: "postcode", kind: "text", label: "^Postcode of the works", short: "^Postcode", autoComplete: "postal-code", placeholder: "^1000" },
    ],
  },
  {
    id: "finish",
    title: "^Last details",
    questions: [
      {
        id: "callTime",
        kind: "choice",
        label: "^Best time to call",
        when: { q: "phone", answered: true },
        options: [
          { value: "morning", label: "^Morning" },
          { value: "afternoon", label: "^Afternoon" },
          { value: "evening", label: "^Evening" },
        ],
      },
      { id: "message", kind: "textarea", label: "^Anything else?", short: "^Note", placeholder: "^Optional" },
      { id: "consent", kind: "consent", label: "^I agree to be contacted about my request (privacy policy).", required: true },
    ],
  },
];
