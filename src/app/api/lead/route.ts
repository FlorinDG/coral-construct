import { FLOW } from "@/lib/form/flow";
import { prune, validateAll } from "@/lib/form/engine";
import type { Answers } from "@/lib/form/types";
import { crmConfig, forwardLead, leadPayload, visitorIpOf } from "@/lib/crm";

// Receives a finished lead. The flow is re-validated server-side with the same
// rules the browser used, and answers outside the visible flow are dropped.
// Destination: the Coral Construct workspace's CRM in CoralOS (lib/crm), once
// CORALOS_LEADS_URL + CORALOS_LEADS_KEY are set; until then leads are logged.

export async function POST(req: Request) {
  let body: { source?: unknown; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const raw = body.answers;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return Response.json({ ok: false, error: "missing_answers" }, { status: 400 });
  }

  const answers = prune(FLOW, raw as Answers);
  const errors = validateAll(FLOW, answers);
  if (Object.keys(errors).length) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    source: typeof body.source === "string" ? body.source.slice(0, 40) : "unknown",
    answers,
  };

  const cfg = crmConfig();
  if (!cfg) {
    console.info("[lead] (CRM not connected)", JSON.stringify(lead));
    return Response.json({ ok: true }, { status: 202 });
  }

  const result = await forwardLead(cfg, leadPayload(answers, lead.source), visitorIpOf(req.headers));
  if (!result.sent) {
    // Keep the lead in the log so it is never lost, and tell the visitor to retry or call.
    console.error("[lead] CRM refused:", result.reason, JSON.stringify(lead));
    return Response.json({ ok: false, error: "crm_unavailable" }, { status: 502 });
  }
  console.info("[lead] filed in CRM", result.id);
  return Response.json({ ok: true }, { status: 201 });
}
