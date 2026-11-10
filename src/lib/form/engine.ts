import type { Answers, Condition, Errors, Question, Step, Value } from "./types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Belgian / international: digits, spaces, +, (), -, ., at least 8 digits.
const PHONE = /^\+?[\d\s().-]{8,20}$/;

export function isAnswered(v: Value | undefined): boolean {
  if (v === undefined || v === false) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return true;
}

export function test(c: Condition | undefined, a: Answers): boolean {
  if (!c) return true;
  if ("all" in c) return c.all.every((x) => test(x, a));
  if ("any" in c) return c.any.some((x) => test(x, a));
  if ("not" in c) return !test(c.not, a);
  const v = a[c.q];
  if ("eq" in c) return v === c.eq;
  if ("in" in c) return typeof v === "string" && c.in.includes(v);
  if ("includes" in c) return Array.isArray(v) && v.includes(c.includes);
  return isAnswered(v) === c.answered;
}

/** Questions of a step that apply given the answers so far. */
export function visibleQuestions(step: Step, a: Answers): Question[] {
  return step.questions.filter((q) => test(q.when, a));
}

/** Steps that apply given the answers so far; recomputed on every change. */
export function visibleSteps(flow: Step[], a: Answers): Step[] {
  return flow.filter((s) => test(s.when, a) && visibleQuestions(s, a).length > 0);
}

export function validateQuestion(q: Question, v: Value | undefined): string | null {
  const has = isAnswered(v);
  if (q.required && !has) {
    return q.kind === "consent" ? "^Please agree to continue" : "^This one is required";
  }
  if (!has) return null;
  if (q.kind === "email" && !EMAIL.test(String(v).trim())) return "^That email looks off";
  if (q.kind === "tel" && !PHONE.test(String(v).trim())) return "^That number looks off";
  if (q.kind === "multi" && q.min && Array.isArray(v) && v.length < q.min) {
    return `^Pick at least ${q.min}`;
  }
  if ((q.kind === "choice" || q.kind === "multi") && v !== undefined) {
    const allowed = new Set(q.options.map((o) => o.value));
    const vals = Array.isArray(v) ? v : [v];
    if (!vals.every((x) => typeof x === "string" && allowed.has(x))) return "^Unknown option";
  }
  return null;
}

export function validateStep(step: Step, a: Answers): Errors {
  const errors: Errors = {};
  for (const q of visibleQuestions(step, a)) {
    const e = validateQuestion(q, a[q.id]);
    if (e) errors[q.id] = e;
  }
  const one = step.requireOneOf;
  if (one && !one.ids.some((id) => isAnswered(a[id]))) {
    for (const id of one.ids) errors[id] ??= one.message;
  }
  return errors;
}

/**
 * Drop answers to questions that no longer apply (the user went back and
 * changed a branch). What is submitted is exactly what the visible flow asked.
 */
export function prune(flow: Step[], a: Answers): Answers {
  const out: Answers = {};
  for (const s of visibleSteps(flow, a)) {
    for (const q of visibleQuestions(s, a)) {
      if (isAnswered(a[q.id])) out[q.id] = a[q.id];
    }
  }
  return out;
}

/** Full check of a submission; used by the client before sending and by the API route. */
export function validateAll(flow: Step[], a: Answers): Errors {
  const clean = prune(flow, a);
  return visibleSteps(flow, clean).reduce<Errors>(
    (acc, s) => ({ ...acc, ...validateStep(s, clean) }),
    {},
  );
}

/** A single-choice-only step can advance as soon as it is answered. */
export function autoAdvances(step: Step, a: Answers): boolean {
  const qs = visibleQuestions(step, a);
  return qs.length === 1 && qs[0].kind === "choice";
}

export type SummaryRow = { stepId: string; questionId: string; label: string; value: string };

/** Answered, visible questions as readable rows (option values → option labels). */
export function summarize(flow: Step[], a: Answers): SummaryRow[] {
  const rows: SummaryRow[] = [];
  for (const s of visibleSteps(flow, a)) {
    for (const q of visibleQuestions(s, a)) {
      const v = a[q.id];
      if (!isAnswered(v) || q.kind === "consent") continue;
      let value: string;
      if (q.kind === "choice" || q.kind === "multi") {
        const vals = Array.isArray(v) ? v : [String(v)];
        value = vals.map((x) => q.options.find((o) => o.value === x)?.label ?? x).join(", ");
      } else {
        value = String(v).trim();
      }
      rows.push({ stepId: s.id, questionId: q.id, label: q.short ?? q.label, value });
    }
  }
  return rows;
}
