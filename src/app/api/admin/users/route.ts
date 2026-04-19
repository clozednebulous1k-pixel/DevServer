import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AdminProfile = {
  role: "admin" | "user";
};

async function ensureAdmin() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: NextResponse.json({ error: "Supabase nao configurado." }, { status: 500 }) };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Nao autenticado." }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<AdminProfile>();

  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }) };
  }

  return { user };
}

export async function GET() {
  const guard = await ensureAdmin();
  if ("error" in guard) return guard.error;

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const [{ data: authUsers, error: authErr }, { data: profiles, error: profileErr }] = await Promise.all([
    adminClient.auth.admin.listUsers({ page: 1, perPage: 200 }),
    adminClient.from("profiles").select("id, role, library_access, created_at").order("created_at", { ascending: false }),
  ]);

  if (authErr || profileErr) {
    return NextResponse.json({ error: "Falha ao carregar usuarios." }, { status: 500 });
  }

  const authMap = new Map((authUsers.users ?? []).map((u) => [u.id, u]));
  const users = (profiles ?? []).map((profile) => {
    const authUser = authMap.get(profile.id);
    return {
      id: profile.id,
      email: authUser?.email ?? "(sem e-mail)",
      role: profile.role,
      libraryAccess: profile.library_access,
      createdAt: profile.created_at,
      lastSignInAt: authUser?.last_sign_in_at ?? null,
    };
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const guard = await ensureAdmin();
  if ("error" in guard) return guard.error;

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

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

  const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr || !created.user) {
    return NextResponse.json({ error: createErr?.message ?? "Nao foi possivel criar usuario." }, { status: 400 });
  }

  const { error: upsertErr } = await adminClient.from("profiles").upsert({
    id: created.user.id,
    role: "user",
    library_access: libraryAccess,
  });

  if (upsertErr) {
    return NextResponse.json({ error: "Usuario criado, mas falhou ao salvar acesso." }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: created.user.id,
      email: created.user.email,
      role: "user",
      libraryAccess,
    },
  });
}

export async function PATCH(request: Request) {
  const guard = await ensureAdmin();
  if ("error" in guard) return guard.error;

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    userId?: string;
    libraryAccess?: boolean;
  };

  if (!body.userId) {
    return NextResponse.json({ error: "userId obrigatorio." }, { status: 400 });
  }

  const { error } = await adminClient
    .from("profiles")
    .update({ library_access: !!body.libraryAccess })
    .eq("id", body.userId);

  if (error) {
    return NextResponse.json({ error: "Falha ao atualizar acesso." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
