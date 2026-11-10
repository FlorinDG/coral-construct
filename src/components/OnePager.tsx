"use client";

import { useLenis } from "lenis/react";
import { CONTACT, CONTACT_SECTION, HERO, NAV, PROCESS, PROOF, SERVICES } from "@/content/site";
import { PROJECT_TYPES } from "@/lib/form/flow";
import { LeadForm } from "./form/LeadForm";
import { LeadSummary } from "./form/LeadSummary";
import { LeadFormProvider, useLeadForm } from "./form/LeadFormProvider";
import { OpenStatus } from "./OpenStatus";
import { SmoothScroll, useSectionReveal } from "./SmoothScroll";

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

function useScrollTo() {
  const lenis = useLenis();
  return (target: string) => {
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  };
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
          <span className="brand-mark" aria-hidden />
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

          <ul className="hero-stats" aria-label="^Key figures">
            {PROOF.stats.map((st, i) => (
              <li key={i} data-r style={d(6 + i)}>
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Services ─────────────────────────────────────────── */}
        <section id="services" className="sec services" data-section>
          <SectionHead eyebrow={SERVICES.eyebrow} title={SERVICES.title} />
          <div className="grid-4">
            {SERVICES.items.map((s, i) => (
              <article key={s.key} className="card service" data-r style={d(2 + i)}>
                <span className={`service-shape service-shape-${i + 1}`} aria-hidden />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          <InlineCta />
        </section>

        {/* ── Proof ────────────────────────────────────────────── */}
        <section id="proof" className="sec proof" data-section>
          <SectionHead eyebrow={PROOF.eyebrow} title={PROOF.title} />
          <div className="grid-4">
            {PROOF.stats.map((s, i) => (
              <div key={i} className="card stat" data-r style={d(2 + i)}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <figure className="quote" data-r style={d(6)}>
            <blockquote>“{PROOF.quote.text}”</blockquote>
            <figcaption>— {PROOF.quote.who}</figcaption>
          </figure>
          <InlineCta />
        </section>

        {/* ── Process ──────────────────────────────────────────── */}
        <section id="process" className="sec process" data-section>
          <SectionHead eyebrow={PROCESS.eyebrow} title={PROCESS.title} />
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
          <SectionHead eyebrow={CONTACT_SECTION.eyebrow} title={CONTACT_SECTION.title} lead={CONTACT_SECTION.lead} />
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

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
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
function Arrow() {
  return (
    <svg {...ic} width={18} height={18} className="arrow">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
