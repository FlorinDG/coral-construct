// Progressive lead form — the shapes the flow is written in.
// Conditions are plain data (not functions) so the same flow definition runs
// in the browser and is re-checked by the /api/lead route.

export type Value = string | string[] | boolean;
export type Answers = Record<string, Value | undefined>;

export type Condition =
  | { q: string; eq: string | boolean }
  | { q: string; in: string[] }
  | { q: string; includes: string } // multi-choice contains option
  | { q: string; answered: boolean }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition };

export type Option = { value: string; label: string; hint?: string };

type Base = {
  id: string;
  label: string;
  /** Shorter label for the "Your request" summary; falls back to `label`. */
  short?: string;
  help?: string;
  required?: boolean;
  when?: Condition;
};

export type Question =
  | (Base & { kind: "choice"; options: Option[] })
  | (Base & { kind: "multi"; options: Option[]; min?: number })
  | (Base & {
      kind: "text" | "email" | "tel" | "textarea";
      placeholder?: string;
      autoComplete?: string;
    })
  | (Base & { kind: "consent" });

export type Step = {
  id: string;
  title: string;
  lead?: string;
  questions: Question[];
  when?: Condition;
  /** At least one of these question ids must be answered (e.g. phone or email). */
  requireOneOf?: { ids: string[]; message: string };
};

export type Errors = Record<string, string>;
