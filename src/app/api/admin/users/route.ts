import { NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";
import { loadUserProfile } from "@/lib/auth/load-profile";
import { loadUsersDirectory } from "@/lib/admin/users-directory";
import { firestoreHelpers, getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

async function ensureAdmin(request: Request) {
  const db = getAdminDb();
  const authAdmin = getAdminAuth();
  if (!db || !authAdmin) {
    return { error: NextResponse.json({ error: "Firebase Admin nao configurado." }, { status: 500 }) };
  }

  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) {
    return { error: NextResponse.json({ error: "Nao autenticado." }, { status: 401 }) };
  }

  const profile = await loadUserProfile(db, decoded.uid);
  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }) };
  }

  return { db, authAdmin };
}

export async function GET(request: Request) {
  const guard = await ensureAdmin(request);
  if ("error" in guard) return guard.error;

  const users = await loadUsersDirectory();
  if (!users) {
    return NextResponse.json({ error: "Falha ao carregar usuarios." }, { status: 500 });
  }

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const guard = await ensureAdmin(request);
  if ("error" in guard) return guard.error;

  const { db, authAdmin } = guard;

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    libraryAccess?: boolean;
  };

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const libraryAccess = !!body.libraryAccess;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "E-mail invalido." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter ao menos 8 caracteres." }, { status: 400 });
  }

  let created;
  try {
    created = await authAdmin.createUser({
      email,
      password,
      emailVerified: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Nao foi possivel criar usuario.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  await db
    .collection("users")
    .doc(created.uid)
    .set({
      role: "user",
      libraryAccess,
      email,
      createdAt: firestoreHelpers.serverTimestamp(),
      updatedAt: firestoreHelpers.serverTimestamp(),
    });

  return NextResponse.json({
    user: {
      id: created.uid,
      email: created.email,
      role: "user",
      libraryAccess,
    },
  });
}

export async function PATCH(request: Request) {
  const guard = await ensureAdmin(request);
  if ("error" in guard) return guard.error;

  const { db } = guard;

  const body = (await request.json()) as {
    userId?: string;
    libraryAccess?: boolean;
  };

  if (!body.userId) {
    return NextResponse.json({ error: "userId obrigatorio." }, { status: 400 });
  }

  const userRef = db.collection("users").doc(body.userId);
  const snap = await userRef.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "Perfil nao encontrado." }, { status: 404 });
  }

  const role = (snap.data() as { role?: string }).role;
  if (role === "admin") {
    return NextResponse.json({ error: "Nao e possivel alterar administrador." }, { status: 400 });
  }

  await userRef.update({
    libraryAccess: !!body.libraryAccess,
    updatedAt: firestoreHelpers.serverTimestamp(),
  });

  return NextResponse.json({ ok: true });
}
