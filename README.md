# coral-website — Coral Construct

One-page lead-generation site. Contact is king: phone in the top bar, in the
hero, in every section CTA, in the contact card, and in a mobile dock.

## Brief

> One page heavily oriented on lead generation. Contact info is king of the page,
> with a balanced mix of shapes and text in the hero area and sections that are
> 100vh, triggered on scroll. Smooth scroll library. A progressive contact form
> that starts simple and only shows useful questions — proper form logic, build
> the structure and define the questions later (prefill with ^placeholder).
> A version in ultra-modern style and another using neumorphism. Colour scheme to
> be refined later.

## Routes

| Route | What |
|---|---|
| `/modern` | Ultra-modern variant |
| `/neumorphism` | Neumorphism variant |
| `/` | Temporary chooser between the two |
| `POST /api/lead` | Receives a finished lead |

## Where things live

- `src/styles/palette.css` — **the only place colours are defined** (temporary values).
- `src/content/site.ts` — all page copy and contact details.
- `src/lib/form/flow.ts` — the form: steps, questions, options and branching (`when`).
- `src/lib/form/engine.ts` — visibility, validation, pruning; shared by browser and API.
- `src/components/OnePager.tsx` — the shared page structure.
- `src/styles/modern.css`, `src/styles/neu.css` — the two looks, scoped by `data-variant`.

Every `^...` string is placeholder copy: `grep -rn '\^' src` lists what is left to write.

## Still open

- Palette (swap in `palette.css`).
- Copy, questions and contact details (`^` placeholders).
- Lead destination: `/api/lead` validates and logs only (`^DESTINATION` in `src/app/api/lead/route.ts`).

## Develop

```bash
npm install
npm run dev
```
