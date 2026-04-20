import { NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";
import { getAdminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

async function verifyCurrentPassword(email: string, currentPassword: string): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: currentPassword,
        returnSecureToken: true,
      }),
    },
  );

  return response.ok;
}

export async function POST(request: Request) {
  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: "Sessao invalida." }, { status: 401 });
  }

  const auth = getAdminAuth();
  if (!auth) {
    return NextResponse.json({ error: "Firebase Admin nao configurado." }, { status: 500 });
  }

  const body = (await request.json()) as ChangePasswordBody;
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");

  if (currentPassword.length < 1) {
    return NextResponse.json({ error: "Informe a senha atual." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "A nova senha deve ter ao menos 8 caracteres." }, { status: 400 });
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "A nova senha deve ser diferente da atual." }, { status: 400 });
  }

  const email = decoded.email ?? "";
  if (!email) {
    return NextResponse.json({ error: "E-mail da sessao nao encontrado." }, { status: 400 });
  }

  const ok = await verifyCurrentPassword(email, currentPassword);
  if (!ok) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
  }

  await auth.updateUser(decoded.uid, { password: newPassword });
  return NextResponse.json({ ok: true });
}
