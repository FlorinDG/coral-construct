"use client";

import { FLOW } from "@/lib/form/flow";
import { summarize } from "@/lib/form/engine";
import { useLeadForm } from "./LeadFormProvider";

/**
 * "Your request" — fills in as the visitor answers, so the progressive form
 * visibly builds something. Earlier answers are buttons back to their step.
 */
export function LeadSummary() {
  const { answers, steps, index, status, goTo } = useLeadForm();
  const rows = summarize(FLOW, answers);
  const reachable = new Set(steps.slice(0, index + 1).map((s) => s.id));
  const progress = Math.round(((status === "sent" ? steps.length : index) / steps.length) * 100);

  return (
    <div className="card summary" aria-live="polite">
      <div className="summary-head">
        <p className="summary-title">^Your request</p>
        <span className="summary-pct">{progress}%</span>
      </div>
      {rows.length === 0 ? (
        <p className="summary-empty">^Your answers appear here as you go.</p>
      ) : (
        <dl className="summary-list">
          {rows.map((r) => {
            const editable = status !== "sent" && reachable.has(r.stepId) && steps[index]?.id !== r.stepId;
            return (
              <div key={r.questionId} className="summary-row">
                <dt>{r.label}</dt>
                <dd>
                  {editable ? (
                    <button type="button" onClick={() => goTo(r.stepId)} aria-label={`^Change: ${r.label}`}>
                      {r.value}
                      <span aria-hidden className="summary-edit">
                        ✎
                      </span>
                    </button>
                  ) : (
                    r.value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
