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
  { value: "newbuild", label: "^New build", hint: "^From plot to keys" },
  { value: "renovation", label: "^Renovation", hint: "^Rooms or the whole house" },
  { value: "extension", label: "^Extension", hint: "^More space, same home" },
  { value: "other", label: "^Something else", hint: "^Tell us in a sentence" },
];

export const FLOW: Step[] = [
  {
    id: "project",
    title: "^What are you planning?",
    questions: [{ id: "project", kind: "choice", label: "^Project type", required: true, options: PROJECT_TYPES }],
  },

  // ── Branch: one scope step per project type ──────────────────────────
  {
    id: "scope-newbuild",
    title: "^About the build",
    when: { q: "project", eq: "newbuild" },
    questions: [
      {
        id: "hasPlot",
        kind: "choice",
        label: "^Do you already have a plot?",
        short: "^Plot",
        required: true,
        options: [
          { value: "yes", label: "^Yes" },
          { value: "searching", label: "^Still searching" },
        ],
      },
      {
        id: "plotLocation",
        kind: "text",
        label: "^Where is the plot?",
        short: "^Plot location",
        placeholder: "^Municipality",
        when: { q: "hasPlot", eq: "yes" },
      },
      {
        id: "hasPermit",
        kind: "choice",
        label: "^Building permit?",
        short: "^Permit",
        when: { q: "hasPlot", eq: "yes" },
        options: [
          { value: "granted", label: "^Granted" },
          { value: "pending", label: "^Applied" },
          { value: "none", label: "^Not yet" },
        ],
      },
    ],
  },
  {
    id: "scope-renovation",
    title: "^What needs work?",
    when: { q: "project", eq: "renovation" },
    questions: [
      {
        id: "rooms",
        kind: "multi",
        label: "^Pick all that apply",
        short: "^Work on",
        required: true,
        min: 1,
        options: [
          { value: "kitchen", label: "^Kitchen" },
          { value: "bathroom", label: "^Bathroom" },
          { value: "roof", label: "^Roof" },
          { value: "facade", label: "^Facade / insulation" },
          { value: "whole", label: "^Whole house" },
        ],
      },
      {
        id: "occupied",
        kind: "choice",
        label: "^Will you live there during the works?",
        short: "^Living there",
        when: { not: { q: "rooms", includes: "whole" } },
        options: [
          { value: "yes", label: "^Yes" },
          { value: "no", label: "^No" },
        ],
      },
    ],
  },
  {
    id: "scope-extension",
    title: "^How much extra space?",
    when: { q: "project", eq: "extension" },
    questions: [
      {
        id: "extensionSize",
        kind: "choice",
        label: "^Approximate size",
        required: true,
        options: [
          { value: "s", label: "^Under 20 m²" },
          { value: "m", label: "^20–40 m²" },
          { value: "l", label: "^Over 40 m²" },
          { value: "unknown", label: "^Not sure yet" },
        ],
      },
    ],
  },
  {
    id: "scope-other",
    title: "^Tell us briefly",
    when: { q: "project", eq: "other" },
    questions: [
      { id: "otherDescription", kind: "textarea", label: "^What do you have in mind?", short: "^Description", required: true, placeholder: "^A sentence or two" },
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
          { value: "lt50", label: "^Under €50k" },
          { value: "50-150", label: "^€50k–150k" },
          { value: "150-400", label: "^€150k–400k" },
          { value: "gt400", label: "^Over €400k" },
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
