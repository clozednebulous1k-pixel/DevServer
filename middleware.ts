import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Biblioteca: só entra quem tem `profiles.library_access` ou admin.
 * `library_access` deve ser gravado só no servidor (Service Role / webhook de pagamento confirmado),
 * nunca por update direto do cliente — RLS em `profiles` não concede UPDATE ao authenticated.
 * Teste race: dois requests simultâneos não devem duplicar cobrança nem reembolso; use idempotency-key no PSP.
 */
type AppRole = "admin" | "user";

async function getRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("role, library_access")
    .eq("id", userId)
    .single();

  return data as { role: AppRole; library_access: boolean } | null;
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  const pathname = request.nextUrl.pathname;
  const isBibliotecaRoute = pathname.startsWith("/biblioteca");
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  if (!isBibliotecaRoute && !isAdminRoute && !isLoginRoute) {
    return response;
  }

  if (!user && (isBibliotecaRoute || isAdminRoute)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (!user) {
    return response;
  }

  const profile = await getRole(supabase, user.id);
  const isAdmin = profile?.role === "admin";
  const hasBibliotecaAccess = isAdmin || !!profile?.library_access;

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isBibliotecaRoute && !hasBibliotecaAccess) {
    return NextResponse.redirect(new URL("/pagamento", request.url));
  }

  if (isLoginRoute) {
    const redirectTarget = isAdmin ? "/admin/orcamentos" : "/biblioteca";
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/biblioteca/:path*", "/admin/:path*", "/login"],
};
