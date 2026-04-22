import { NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";
import { createProject, listProjectsByOwner } from "@/lib/criar/project-store";
import { applyRateLimit, getClientIpFromRequest } from "@/lib/security/rate-limit";

async function requireUser(request: Request): Promise<{ uid: string } | { error: NextResponse }> {
  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) {
    return { error: NextResponse.json({ error: "Nao autenticado." }, { status: 401 }) };
  }
  return { uid: decoded.uid };
}

export async function GET(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`criar-projects-get:${ip}`, { limit: 60, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Muitas requisicoes." }, { status: 429 });
  }

  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const projects = await listProjectsByOwner(auth.uid);
  if (!projects) {
    return NextResponse.json({ error: "Falha ao carregar projetos." }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`criar-projects-post:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Muitas tentativas." }, { status: 429 });
  }

  const auth = await requireUser(request);
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as { name?: string };
  const name = body.name?.trim() || "Novo projeto";

  const project = await createProject(auth.uid, name.slice(0, 80));
  if (!project) {
    return NextResponse.json({ error: "Nao foi possivel criar o projeto." }, { status: 500 });
  }

  return NextResponse.json({ project }, { status: 201 });
}
