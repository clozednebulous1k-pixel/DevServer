import { NextResponse } from "next/server";
import { firestoreHelpers, getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

/**
 * Cria o primeiro usuário administrador (Auth + Firestore).
 * Só roda se NÃO existir nenhum documento `users/*` com `role: "admin"`.
 * Protegido por ADMIN_BOOTSTRAP_SECRET no body ou header Authorization: Bearer.
 *
 * Uso local (após configurar Firebase Admin no .env):
 * curl -X POST http://localhost:3000/api/admin/bootstrap \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"admin@teste.local","password":"SuaSenhaSegura123","secret":"MESMO_VALOR_DE_ADMIN_BOOTSTRAP_SECRET"}'
 */
export async function POST(request: Request) {
  const secretEnv = process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
  if (!secretEnv || secretEnv.length < 16) {
    return NextResponse.json(
      {
        error:
          "Bootstrap desabilitado: defina ADMIN_BOOTSTRAP_SECRET no .env (minimo 16 caracteres). Remova em producao se nao for usar.",
      },
      { status: 503 },
    );
  }

  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) {
    return NextResponse.json({ error: "Firebase Admin nao configurado." }, { status: 500 });
  }

  let body: { email?: string; password?: string; secret?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string; secret?: string };
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const secret = (body.secret ?? bearer ?? "").trim();
  if (secret !== secretEnv) {
    return NextResponse.json({ error: "Secret invalido." }, { status: 403 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "E-mail invalido." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter ao menos 8 caracteres." }, { status: 400 });
  }

  const adminsSnap = await db.collection("users").where("role", "==", "admin").limit(1).get();
  if (!adminsSnap.empty) {
    return NextResponse.json(
      {
        error:
          "Ja existe um administrador. Use o painel /admin/orcamentos ou o Firebase Console para criar outros usuarios.",
      },
      { status: 403 },
    );
  }

  let uid: string;

  try {
    const created = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });
    uid = created.uid;
  } catch (err: unknown) {
    const code = typeof err === "object" && err && "code" in err ? String((err as { code?: string }).code) : "";
    if (code === "auth/email-already-exists") {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
    } else {
      const message = err instanceof Error ? err.message : "Falha ao criar usuario.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  await db
    .collection("users")
    .doc(uid)
    .set(
      {
        role: "admin",
        libraryAccess: true,
        email,
        createdAt: firestoreHelpers.serverTimestamp(),
        updatedAt: firestoreHelpers.serverTimestamp(),
        source: "bootstrap",
      },
      { merge: true },
    );

  return NextResponse.json({
    ok: true,
    message: "Admin criado. Faca login em /login com o e-mail e senha informados.",
    uid,
    email,
  });
}
