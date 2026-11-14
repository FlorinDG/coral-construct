"use client";

import { CONTACT, CONTACT_SECTION, HERO, NAV, PROCESS, PROOF, SERVICES, SWATCHES } from "@/content/site";
import { BeforeAfter } from "./BeforeAfter";
import { Logo } from "./Logo";
import { PROJECT_TYPES } from "@/lib/form/flow";
import { LeadForm } from "./form/LeadForm";
import { LeadSummary } from "./form/LeadSummary";
import { LeadFormProvider, useLeadForm } from "./form/LeadFormProvider";
import { OpenStatus } from "./OpenStatus";
import { Services } from "./Services";
import { SmoothScroll, useScrollTo, useSectionReveal } from "./SmoothScroll";

export type Variant = "modern" | "neu";

/**
 * The one-page structure shared by every style variant. Markup and behaviour
 * live here; each variant only brings its stylesheet (scoped by data-variant).
 */
export function OnePager({ variant, className = "" }: { variant: Variant; className?: string }) {
  return (
    <SmoothScroll>
      <LeadFormProvider source={variant}>
        <Page variant={variant} className={className} />
      </LeadFormProvider>
    </SmoothScroll>
  );
}

function d(n: number) {
  return { "--d": n } as React.CSSProperties;
}

function Page({ variant, className }: { variant: Variant; className: string }) {
  useSectionReveal();
  const scrollTo = useScrollTo();
  const { start } = useLeadForm();

  return (
    <div className={`site ${className}`} data-variant={variant}>
      <a className="skip" href="#contact">
        ^Skip to contact
      </a>

      <header className="topbar">
        <a href="#top" className="brand" aria-label={CONTACT.company}>
          <Logo className="brand-mark" />
          <span className="brand-name">{CONTACT.company}</span>
        </a>
        <nav className="topnav" aria-label="^Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="topbar-mail" href={CONTACT.emailHref}>
          <MailIcon />
          <span>
            <small>^Email us</small>
            {CONTACT.email}
          </span>
        </a>
        <a className="topbar-phone" href={CONTACT.phoneHref}>
          <PhoneIcon />
          <span>
            <small>
              <OpenStatus />
            </small>
            {CONTACT.phone}
          </span>
        </a>
        <a className="btn btn-primary topbar-cta" href="#contact">
          ^Free quote
        </a>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section id="top" className="sec hero" data-section>
          <div className="hero-shapes" aria-hidden>
            <span className="shape shape-1" />
            <span className="shape shape-2" />
            <span className="shape shape-3" />
            <span className="shape shape-4" />
            <span className="shape shape-5" />
          </div>

          <div className="hero-copy">
            <p className="eyebrow" data-r style={d(0)}>
              {HERO.eyebrow}
            </p>
            <h1 className="hero-title">
              {HERO.title.map((line, i) => (
                <span key={i} data-r style={d(1 + i)}>
                  {line}
                  {i === HERO.title.length - 1 && <Brush />}
                </span>
              ))}
            </h1>
            <p className="hero-lead" data-r style={d(3)}>
              {HERO.lead}
            </p>

            <div className="hero-contact" data-r style={d(4)}>
              <a className="hero-phone" href={CONTACT.phoneHref}>
                <PhoneIcon />
                <span>
                  <small>^Call us now</small>
                  {CONTACT.phone}
                </span>
              </a>
              <a className="hero-mail" href={CONTACT.emailHref}>
                {CONTACT.email}
              </a>
              <p className="hero-promise">
                <span className="dot" aria-hidden /> {CONTACT.responsePromise}
              </p>
            </div>
          </div>

          <div className="hero-card card" data-r style={d(5)}>
            <p className="hero-card-label">{HERO.quickStartLabel}</p>
            <div className="quick">
              {PROJECT_TYPES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className="quick-option"
                  onClick={() => {
                    start(p.value);
                    scrollTo("#contact");
                  }}
                >
                  <span>{p.label}</span>
                  <small>{p.hint}</small>
                  <Arrow />
                </button>
              ))}
            </div>
          </div>

          {/* The colour fan stands on the figures strip, so it follows the layout at every size. */}
          <div className="hero-foot">
            <div className="swatches" aria-hidden style={{ "--n": SWATCHES.length } as React.CSSProperties}>
              {SWATCHES.map((sw, i) => (
                <span key={sw.hex} className="swatch" style={{ "--i": i, "--c": sw.hex } as React.CSSProperties}>
                  <small>
                    {sw.name}
                    <br />
                    {sw.hex.slice(1)}
                  </small>
                </span>
              ))}
            </div>
            <ul className="hero-stats" aria-label="^Key figures">
              {PROOF.stats.map((st, i) => (
                <li key={i} data-r style={d(6 + i)}>
                  <strong>{st.value}</strong>
                  <span>{st.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────── */}
        <section id="services" className="sec services" data-section>
          <SectionHead eyebrow={SERVICES.eyebrow} title={SERVICES.title} chip={2} />
          <div className="svc-wrap" data-r style={d(2)}>
            <Services items={SERVICES.items} />
          </div>
          <InlineCta />
        </section>

        {/* ── Proof ────────────────────────────────────────────── */}
        <section id="proof" className="sec proof" data-section>
          <SectionHead eyebrow={PROOF.eyebrow} title={PROOF.title} chip={4} />
          <div className="proof-grid">
            <div className="card proof-ba" data-r style={d(2)}>
              <BeforeAfter {...PROOF.beforeAfter} />
            </div>
            <div className="proof-side">
              <figure className="quote" data-r style={d(3)}>
                <blockquote>“{PROOF.quote.text}”</blockquote>
                <figcaption>— {PROOF.quote.who}</figcaption>
              </figure>
              <ul className="proof-points">
                {PROOF.points.map((pt, i) => (
                  <li key={pt} data-r style={d(4 + i)}>
                    <Check /> {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <InlineCta />
        </section>

        {/* ── Process ──────────────────────────────────────────── */}
        <section id="process" className="sec process" data-section>
          <SectionHead eyebrow={PROCESS.eyebrow} title={PROCESS.title} chip={5} />
          <ol className="steps">
            {PROCESS.steps.map((s, i) => (
              <li key={i} className="card step" data-r style={d(2 + i)}>
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <InlineCta />
        </section>

        {/* ── Contact ──────────────────────────────────────────── */}
        <section id="contact" className="sec contact" data-section>
          <SectionHead eyebrow={CONTACT_SECTION.eyebrow} title={CONTACT_SECTION.title} lead={CONTACT_SECTION.lead} chip={1} />
          <aside className="card contact-card" data-r style={d(2)} aria-label="^Contact details">
          <a className="contact-line contact-phone" href={CONTACT.phoneHref}>
            <PhoneIcon />
            <span>
              <small>^Phone</small>
              {CONTACT.phone}
            </span>
          </a>
          <a className="contact-line" href={CONTACT.emailHref}>
            <MailIcon />
            <span>
              <small>^Email</small>
              {CONTACT.email}
            </span>
          </a>
          <a className="contact-line" href={CONTACT.whatsappHref} target="_blank" rel="noopener">
            <ChatIcon />
            <span>
              <small>^WhatsApp</small>
              ^Message us
            </span>
          </a>
          <div className="contact-line">
            <PinIcon />
            <span>
              <small>^Office</small>
              {CONTACT.address.join(", ")}
            </span>
          </div>
          <p className="contact-hours">
            <OpenStatus />
            <span>{CONTACT.hours}</span>
          </p>
          </aside>
          <div className="contact-grid">
            <div className="card form-card" data-r style={d(3)}>
              <LeadForm />
            </div>
            <div className="summary-wrap" data-r style={d(4)}>
              <LeadSummary />
            </div>
          </div>
          <footer className="footer">
            <Logo className="footer-mark" />
            <span>
              © {CONTACT.copyrightYear} {CONTACT.company}
            </span>
            <span>{CONTACT.vat}</span>
            <a href="#">^Privacy</a>
          </footer>
        </section>
      </main>

      {/* Mobile: contact always one thumb away */}
      <nav className="dock" aria-label="^Quick contact">
        <a href={CONTACT.phoneHref}>
          <PhoneIcon />
          ^Call
        </a>
        <a href={CONTACT.whatsappHref} target="_blank" rel="noopener">
          <ChatIcon />
          ^WhatsApp
        </a>
        <a href="#contact" className="dock-primary">
          ^Free quote
        </a>
      </nav>
    </div>
  );
}

/** Section heading; `chip` pins one palette colour (index into SWATCHES) as a paint chip in the corner. */
function SectionHead({ eyebrow, title, lead, chip }: { eyebrow: string; title: string; lead?: string; chip?: number }) {
  const sw = chip === undefined ? null : SWATCHES[chip];
  const tilt = (chip ?? 0) % 2 ? "-7deg" : "6deg";
  return (
    <>
      {sw && (
        <span className="chip" aria-hidden data-r style={{ "--c": sw.hex, "--tilt": tilt, "--d": 2 } as React.CSSProperties}>
          <small>
            {sw.name}
            <br />
            {sw.hex.slice(1)}
          </small>
        </span>
      )}
      <header className="sec-head">
        <p className="eyebrow" data-r style={d(0)}>
          {eyebrow}
        </p>
        <h2 data-r style={d(1)}>
          {title}
        </h2>
        {lead && (
          <p className="sec-lead" data-r style={d(1)}>
            {lead}
          </p>
        )}
      </header>
    </>
  );
}

function InlineCta() {
  return (
    <div className="inline-cta" data-r style={d(7)}>
      <a className="btn btn-primary" href="#contact">
        ^Get a free quote <Arrow />
      </a>
      <a className="btn btn-ghost" href={CONTACT.phoneHref}>
        <PhoneIcon /> {CONTACT.phone}
      </a>
    </div>
  );
}

/* Icons — inline, stroke follows currentColor */
const ic = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
function PhoneIcon() {
  return (
    <svg {...ic}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg {...ic}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg {...ic}>
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg {...ic}>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
/** Hand-drawn brush swash behind the last headline line. */
function Brush() {
  return (
    <svg className="brush" viewBox="0 0 600 64" preserveAspectRatio="none" aria-hidden>
      <path d="M6 30C70 18 190 15 310 14s210-4 282 4l4 9c-30 3-8 11-34 15-150 14-310 18-470 16-40 0-80 4-92-6-6-6-6-16 6-22z" />
      <path d="M40 50c120 4 300 2 470-6" className="brush-dry" />
      <path d="M520 20c30-1 52 1 72 4" className="brush-dry" />
    </svg>
  );
}
function Check() {
  return (
    <svg {...ic} width={18} height={18}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}
function Arrow() {
  return (
    <svg {...ic} width={18} height={18} className="arrow">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
