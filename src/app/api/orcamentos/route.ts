import { NextResponse } from "next/server";
import { clampOrcamentoField } from "@/lib/orcamento-limits";
import { firestoreHelpers, getAdminDb } from "@/lib/firebase/admin";
import { applyRateLimit, getClientIpFromRequest } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`orcamentos:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas requisicoes. Aguarde um minuto e tente novamente." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Firestore nao configurado." }, { status: 500 });
  }

  let json: Record<string, unknown>;
  try {
    json = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const payload = {
    full_name: clampOrcamentoField("full_name", String(json.full_name ?? "")),
    email: clampOrcamentoField("email", String(json.email ?? "")),
    whatsapp: clampOrcamentoField("whatsapp", String(json.whatsapp ?? "")),
    company: clampOrcamentoField("company", String(json.company ?? "")),
    project_type: clampOrcamentoField("project_type", String(json.project_type ?? "")),
    budget_range: clampOrcamentoField("budget_range", String(json.budget_range ?? "")),
    desired_deadline: clampOrcamentoField("desired_deadline", String(json.desired_deadline ?? "")),
    start_date: clampOrcamentoField("start_date", String(json.start_date ?? "")),
    project_goal: clampOrcamentoField("project_goal", String(json.project_goal ?? "")),
    desired_features: clampOrcamentoField("desired_features", String(json.desired_features ?? "")),
    references_url: clampOrcamentoField("references_url", String(json.references_url ?? "")),
    additional_notes: clampOrcamentoField("additional_notes", String(json.additional_notes ?? "")),
  };

  if (!payload.full_name || !payload.email || !payload.project_type || !payload.budget_range || !payload.desired_deadline) {
    return NextResponse.json({ error: "Campos obrigatorios faltando." }, { status: 400 });
  }

  await db.collection("orcamentos").add({
    ...payload,
    createdAt: firestoreHelpers.serverTimestamp(),
    source: "site",
  });

  return NextResponse.json({ ok: true });
}
