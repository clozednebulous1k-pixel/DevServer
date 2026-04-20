import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_MAX_AGE_DAYS, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { applyRateLimit, getClientIpFromRequest } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIpFromRequest(request);
  const rate = applyRateLimit(`auth-session:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Firebase Admin nao configurado." }, { status: 500 });
  }

  const body = (await request.json()) as { idToken?: string; remember?: boolean };
  const idToken = body.idToken?.trim();
  const remember = !!body.remember;
  if (!idToken) {
    return NextResponse.json({ error: "idToken obrigatorio." }, { status: 400 });
  }

  const expiresInMs = remember
    ? SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
    : 12 * 60 * 60 * 1000;

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
    const response = NextResponse.json({ ok: true });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInMs / 1000,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Token invalido ou expirado." }, { status: 401 });
  }
}
