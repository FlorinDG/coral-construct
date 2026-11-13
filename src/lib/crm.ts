import { FLOW } from "@/lib/form/flow";
import { summarize } from "@/lib/form/engine";
import type { Answers } from "@/lib/form/types";

// Server only: forwards a validated lead into the Coral Construct workspace's
// CRM in CoralOS (WEB-FORM-1 door, server-to-server with the site's SECRET key).
//
// Contract (CoralOS `POST /api/leads`):
//   Authorization: Bearer <secret server key>   — never sent from a browser
//   X-Visitor-IP: <visitor address>              — the door throttles on it
//   no Origin header (a server request has none; an Origin with a secret is refused)
//   body { name, email?, phone?, service, message?, details: [{ key, label, value }] }
//   201 { id } · 4xx/5xx { error: <refusal> }
//
// Switched on by two server-only env vars; without them nothing is sent and the
// route keeps logging leads. A request without the key would file into the
// platform owner's CRM, so the key is never optional once a URL is set.

const TIMEOUT_MS = 8000;

export type CrmConfig = { url: string; key: string };

export function crmConfig(env: Record<string, string | undefined> = process.env): CrmConfig | null {
  const url = env.CORALOS_LEADS_URL?.trim();
  const key = env.CORALOS_LEADS_KEY?.trim();
  return url && key ? { url, key } : null;
}

type Detail = { key: string; label: string; value: string | boolean };
export type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  service: string;
  message?: string;
  details: Detail[];
};

const CONTACT = new Set(["name", "email", "phone", "message"]);
const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

/** The lead as the CRM takes it: contact fields on the lead, every other answer as a labelled detail. */
export function leadPayload(answers: Answers, source: string): LeadPayload {
  const rows = summarize(FLOW, answers);
  const service = rows.find((r) => r.questionId === "project")?.value ?? "";
  const details: Detail[] = rows
    .filter((r) => !CONTACT.has(r.questionId) && r.questionId !== "project")
    .map((r) => ({ key: r.questionId, label: r.label, value: r.value }));
  if (answers.consent === true) details.push({ key: "consent", label: "^Agreed to be contacted", value: true });
  details.push({ key: "form", label: "^Form", value: source });

  return {
    name: text(answers.name) ?? "",
    ...(text(answers.email) && { email: text(answers.email) }),
    ...(text(answers.phone) && { phone: text(answers.phone) }),
    service,
    ...(text(answers.message) && { message: text(answers.message) }),
    details,
  };
}

export type ForwardResult = { sent: true; id: string } | { sent: false; reason: string };

export async function forwardLead(cfg: CrmConfig, payload: LeadPayload, visitorIp: string | null): Promise<ForwardResult> {
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.key}`,
        ...(visitorIp && { "X-Visitor-IP": visitorIp }),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { id?: unknown; error?: unknown };
    if (res.status === 201 && typeof data.id === "string") return { sent: true, id: data.id };
    return { sent: false, reason: typeof data.error === "string" ? data.error : `http_${res.status}` };
  } catch (e) {
    return { sent: false, reason: e instanceof Error && e.name === "TimeoutError" ? "timeout" : "network" };
  }
}

/** The visitor's address as Vercel forwards it (first hop of x-forwarded-for). */
export function visitorIpOf(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || headers.get("x-real-ip")?.trim() || null;
}
