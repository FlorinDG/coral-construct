import { FLOW } from "@/lib/form/flow";
import { prune, validateAll } from "@/lib/form/engine";
import type { Answers } from "@/lib/form/types";

// Receives a finished lead. The flow is re-validated server-side with the same
// rules the browser used, and answers outside the visible flow are dropped.
//
// ^DESTINATION: where leads go (CRM / mail / CoralOS) is not decided yet —
// until then they are only written to the server log.

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
  console.info("[lead]", JSON.stringify(lead));

  return Response.json({ ok: true }, { status: 202 });
}
