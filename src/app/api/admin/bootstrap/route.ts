import { NextResponse } from "next/server";
import {
  firestoreHelpers,
  getAdminAuth,
  getAdminDb,
  getFirebaseAdminDiagnostics,
} from "@/lib/firebase/admin";

/** Runtime Node obrigatorio para firebase-admin + Buffer na decodificacao Base64. */
export const runtime = "nodejs";

/** Diagnostico seguro (sem secrets): use GET no navegador para ver se a Vercel esta configurada. */
export async function GET() {
  const secretRaw = process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
  const bootstrapSecretConfigured = !!(secretRaw && secretRaw.length >= 16);
  const firebase = getFirebaseAdminDiagnostics();
  const firebaseAdminConfigured = firebase.initOk;
  const auth = getAdminAuth();
  const db = getAdminDb();
  const ready = bootstrapSecretConfigured && !!(auth && db);

  let hint =
    "Se readyForBootstrap for true, envie POST com JSON: email, password, secret (igual ADMIN_BOOTSTRAP_SECRET).";
  if (!bootstrapSecretConfigured) {
    hint =
      "Defina ADMIN_BOOTSTRAP_SECRET na Vercel (Production), minimo 16 caracteres, salve e rode Redeploy.";
  } else if (!firebaseAdminConfigured) {
    hint = firebase.hint ?? "Configure as credenciais Firebase Admin na Vercel e redeploy.";
  }

  return NextResponse.json({
    bootstrapSecretConfigured,
    firebaseAdminConfigured,
    readyForBootstrap: ready,
    firebase,
    hint,
  });
}

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
        code: "ADMIN_BOOTSTRAP_SECRET_REQUIRED",
        error:
          "Bootstrap desabilitado na Vercel: adicione a variavel ADMIN_BOOTSTRAP_SECRET (minimo 16 caracteres) em Settings > Environment Variables > Production e faca Redeploy.",
      },
      { status: 422 },
    );
  }

  const auth = getAdminAuth();
  const db = getAdminDb();
  if (!auth || !db) {
    const firebase = getFirebaseAdminDiagnostics();
    return NextResponse.json(
      {
        code: "FIREBASE_ADMIN_MISSING",
        error:
          "Firebase Admin nao inicializou no servidor. Veja o objeto \"firebase\" abaixo (hint) e corrija as variaveis na Vercel.",
        firebase,
      },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string; secret?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string; secret?: string };
  } catch {
    return NextResponse.json({ code: "INVALID_JSON", error: "JSON invalido no body." }, { status: 400 });
  }

  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const secret = (body.secret ?? bearer ?? "").trim();
  if (secret !== secretEnv) {
    return NextResponse.json({ error: "Secret invalido." }, { status: 403 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email.includes("@")) {
    return NextResponse.json({ code: "INVALID_EMAIL", error: "E-mail invalido." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { code: "PASSWORD_TOO_SHORT", error: "Senha deve ter ao menos 8 caracteres." },
      { status: 400 },
    );
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
      return NextResponse.json(
        {
          code: "FIREBASE_CREATE_USER_FAILED",
          error: message,
          firebaseAuthCode: code || undefined,
        },
        { status: 400 },
      );
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
