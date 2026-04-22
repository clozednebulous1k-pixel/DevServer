import { NextResponse } from "next/server";
import { getProjectById, saveProjectSchema } from "@/lib/criar/project-store";
import { validateCriarSchema } from "@/lib/criar/schema";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";
import { applyRateLimit, getClientIpFromRequest } from "@/lib/security/rate-limit";

async function loadOwnedProject(request: Request, projectId: string) {
  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) return { error: NextResponse.json({ error: "Nao autenticado." }, { status: 401 }) };

  const project = await getProjectById(projectId);
  if (!project) return { error: NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 }) };
  if (project.ownerUid !== decoded.uid) {
    return { error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }) };
  }

  return { project };
}

type Params = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, { params }: Params) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`criar-project-get:${ip}`, { limit: 80, windowMs: 60_000 });
  if (!rate.allowed) return NextResponse.json({ error: "Muitas requisicoes." }, { status: 429 });

  const { projectId } = await params;
  const loaded = await loadOwnedProject(request, projectId);
  if ("error" in loaded) return loaded.error;

  return NextResponse.json({ project: loaded.project });
}

export async function PUT(request: Request, { params }: Params) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`criar-project-put:${ip}`, { limit: 30, windowMs: 60_000 });
  if (!rate.allowed) return NextResponse.json({ error: "Muitas alteracoes em pouco tempo." }, { status: 429 });

  const { projectId } = await params;
  const loaded = await loadOwnedProject(request, projectId);
  if ("error" in loaded) return loaded.error;

  const body = (await request.json()) as {
    name?: string;
    status?: "draft" | "published";
    schema?: unknown;
  };

  const validated = validateCriarSchema(body.schema);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const ok = await saveProjectSchema(projectId, {
    name: body.name?.trim().slice(0, 80),
    status: body.status === "published" ? "published" : "draft",
    schema: validated.value,
  });

  if (!ok) return NextResponse.json({ error: "Falha ao salvar projeto." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
