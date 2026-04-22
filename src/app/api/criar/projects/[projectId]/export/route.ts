import { NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";
import { getProjectById } from "@/lib/criar/project-store";
import { applyRateLimit, getClientIpFromRequest } from "@/lib/security/rate-limit";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(request: Request, { params }: Params) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`criar-project-export:${ip}`, { limit: 25, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: "Muitas exportacoes em pouco tempo." }, { status: 429 });
  }

  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 });

  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project) return NextResponse.json({ error: "Projeto nao encontrado." }, { status: 404 });
  if (project.ownerUid !== decoded.uid) return NextResponse.json({ error: "Acesso negado." }, { status: 403 });

  return NextResponse.json(
    {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        schema: project.schema,
      },
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="${project.id}-project.json"`,
      },
    },
  );
}
