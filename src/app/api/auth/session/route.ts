import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE_MAX_AGE_DAYS, SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";

export async function POST(request: Request) {
  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Firebase Admin nao configurado." }, { status: 500 });
  }

  const body = (await request.json()) as { idToken?: string };
  const idToken = body.idToken?.trim();
  if (!idToken) {
    return NextResponse.json({ error: "idToken obrigatorio." }, { status: 400 });
  }

  const expiresInMs = SESSION_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

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
