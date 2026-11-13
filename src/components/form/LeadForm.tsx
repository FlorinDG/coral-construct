"use client";

import { useEffect, useRef } from "react";
import { visibleQuestions } from "@/lib/form/engine";
import type { Question, Value } from "@/lib/form/types";
import { useLeadForm } from "./LeadFormProvider";

export function LeadForm() {
  const { answers, errors, steps, step, index, status, set, next, back } = useLeadForm();
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // Move focus to the new step's title so keyboard / screen-reader users follow along.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    head.current?.focus({ preventScroll: true });
  }, [step.id]);

  if (status === "sent") {
    return (
      <div className="lf lf-done" role="status">
        <div className="lf-done-mark" aria-hidden>✓</div>
        <h3 className="lf-title">^Thank you — we&apos;ll be in touch</h3>
        <p className="lf-lead">^Usually within one working day.</p>
      </div>
    );
  }

  const qs = visibleQuestions(step, answers);
  const last = index === steps.length - 1;
  const progress = Math.round(((index + 1) / steps.length) * 100);

  return (
    <form
      className="lf"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
    >
      <div
        className="lf-progress"
        role="progressbar"
        aria-label="^Form progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="lf-step" key={step.id}>
        <h3 className="lf-title" ref={head} tabIndex={-1}>
          {step.title}
        </h3>
        {step.lead && <p className="lf-lead">{step.lead}</p>}

        {qs.map((q) => (
          <Field
            key={q.id}
            q={q}
            value={answers[q.id]}
            error={errors[q.id]}
            onChange={(v) => set(q.id, v)}
            solo={qs.length === 1}
            optional={!q.required && !step.requireOneOf?.ids.includes(q.id)}
          />
        ))}
      </div>

      {status === "error" && (
        <p className="lf-error lf-send-error" role="alert">
          ^Sending failed — please try again or call us directly.
        </p>
      )}

      <div className="lf-nav">
        {index > 0 ? (
          <button type="button" className="lf-back" onClick={back}>
            ← ^Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="lf-next" disabled={status === "sending"}>
          {status === "sending" ? "^Sending…" : last ? "^Send my request" : "^Next"}
        </button>
      </div>
    </form>
  );
}

function Field({
  q,
  value,
  error,
  onChange,
  solo,
  optional,
}: {
  q: Question;
  value: Value | undefined;
  error?: string;
  onChange: (v: Value | undefined) => void;
  solo: boolean;
  optional: boolean;
}) {
  const id = `lf-${q.id}`;
  const err = error ? `${id}-err` : undefined;
  const errorNode = error && (
    <p className="lf-error" id={err} role="alert">
      {error}
    </p>
  );

  if (q.kind === "choice" || q.kind === "multi") {
    const multi = q.kind === "multi";
    const sel = multi ? ((value as string[] | undefined) ?? []) : value;
    return (
      <fieldset className="lf-field" aria-describedby={err}>
        <legend className={solo ? "sr-only" : "lf-label"}>
          {q.label}
          {optional && !solo && <em> ^optional</em>}
        </legend>
        <div className={`lf-options${q.options.some((o) => o.hint) ? " lf-options-rich" : ""}`}>
          {q.options.map((o) => {
            const on = multi ? (sel as string[]).includes(o.value) : sel === o.value;
            return (
              <button
                key={o.value}
                type="button"
                className="lf-option"
                aria-pressed={on}
                onClick={() => {
                  if (!multi) return onChange(o.value);
                  const cur = sel as string[];
                  onChange(on ? cur.filter((x) => x !== o.value) : [...cur, o.value]);
                }}
              >
                <span className="lf-option-label">{o.label}</span>
                {o.hint && <span className="lf-option-hint">{o.hint}</span>}
              </button>
            );
          })}
        </div>
        {errorNode}
      </fieldset>
    );
  }

  if (q.kind === "consent") {
    return (
      <div className="lf-field">
        <label className="lf-consent">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error}
            aria-describedby={err}
          />
          <span>{q.label}</span>
        </label>
        {errorNode}
      </div>
    );
  }

  const common = {
    id,
    name: q.id,
    value: (value as string | undefined) ?? "",
    placeholder: q.placeholder,
    autoComplete: q.autoComplete,
    "aria-invalid": !!error,
    "aria-describedby": err,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };

  return (
    <div className="lf-field">
      <label className="lf-label" htmlFor={id}>
        {q.label}
        {optional && <em> ^optional</em>}
      </label>
      {q.kind === "textarea" ? (
        <textarea className="lf-input" rows={3} {...common} />
      ) : (
        <input className="lf-input" type={q.kind} inputMode={q.kind === "tel" ? "tel" : undefined} {...common} />
      )}
      {errorNode}
    </div>
  );
}
