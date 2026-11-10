"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { FLOW } from "@/lib/form/flow";
import { autoAdvances, prune, validateAll, validateStep, visibleSteps } from "@/lib/form/engine";
import type { Answers, Errors, Step, Value } from "@/lib/form/types";

type Status = "editing" | "sending" | "sent" | "error";

type Ctx = {
  answers: Answers;
  errors: Errors;
  steps: Step[];
  step: Step;
  index: number;
  status: Status;
  set: (id: string, v: Value | undefined) => void;
  next: () => void;
  back: () => void;
  submit: () => Promise<void>;
  /** Answer the first question from outside the form (hero quick-start). */
  start: (project: string) => void;
  /** Jump back to an earlier step (from the summary). */
  goTo: (stepId: string) => void;
};

const LeadFormContext = createContext<Ctx | null>(null);

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) throw new Error("useLeadForm outside LeadFormProvider");
  return ctx;
}

export function LeadFormProvider({ children, source }: { children: React.ReactNode; source: string }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Errors>({});
  const [cursor, setCursor] = useState(FLOW[0].id);
  const [status, setStatus] = useState<Status>("editing");

  const steps = useMemo(() => visibleSteps(FLOW, answers), [answers]);
  const found = steps.findIndex((s) => s.id === cursor);
  const index = found === -1 ? 0 : found;
  const step = steps[index];

  const go = useCallback(
    (a: Answers, from: number, delta: number) => {
      const list = visibleSteps(FLOW, a);
      const target = list[Math.max(0, Math.min(list.length - 1, from + delta))];
      setCursor(target.id);
      setErrors({});
    },
    [],
  );

  const submit = useCallback(async () => {
    const all = validateAll(FLOW, answers);
    if (Object.keys(all).length) {
      setErrors(all);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ source, answers: prune(FLOW, answers) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }, [answers, source]);

  const next = useCallback(() => {
    const e = validateStep(step, answers);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (index === steps.length - 1) void submit();
    else go(answers, index, 1);
  }, [answers, go, index, step, steps.length, submit]);

  const set = useCallback(
    (id: string, v: Value | undefined) => {
      const a = { ...answers, [id]: v };
      setAnswers(a);
      setErrors((e) => {
        if (!e[id]) return e;
        const rest = { ...e };
        delete rest[id];
        return rest;
      });
      // One tap on a single-choice step moves on by itself.
      if (autoAdvances(step, a) && step.questions.some((q) => q.id === id) && v !== undefined) {
        setTimeout(() => go(a, visibleSteps(FLOW, a).findIndex((s) => s.id === step.id), 1), 180);
      }
    },
    [answers, go, step],
  );

  const back = useCallback(() => go(answers, index, -1), [answers, go, index]);

  const start = useCallback(
    (project: string) => {
      const a = { ...answers, project };
      setAnswers(a);
      setStatus("editing");
      go(a, 0, 1);
    },
    [answers, go],
  );

  const goTo = useCallback(
    (stepId: string) => {
      const i = steps.findIndex((s) => s.id === stepId);
      if (i === -1 || i > index || status === "sending") return;
      setCursor(stepId);
      setErrors({});
      setStatus("editing");
    },
    [index, status, steps],
  );

  const value: Ctx = { answers, errors, steps, step, index, status, set, next, back, submit, start, goTo };
  return <LeadFormContext.Provider value={value}>{children}</LeadFormContext.Provider>;
}
