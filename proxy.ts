import { NextResponse, type NextRequest } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { loadUserProfile } from "@/lib/auth/load-profile";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isBibliotecaRoute = pathname.startsWith("/biblioteca");
  const isAdminRoute = pathname.startsWith("/admin");
  const isPainelRoute = pathname.startsWith("/painel");
  const isCriarRoute = pathname.startsWith("/criar");
  const isLoginRoute = pathname.startsWith("/login");

  if (!isBibliotecaRoute && !isAdminRoute && !isPainelRoute && !isCriarRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  const db = getAdminDb();
  const { decoded } = await verifySessionFromRequest(request);

  if (!db) {
    if (isBibliotecaRoute || isAdminRoute || isPainelRoute || isCriarRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!decoded && (isBibliotecaRoute || isAdminRoute || isPainelRoute || isCriarRoute)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (!decoded) {
    return NextResponse.next();
  }

  const profile = await loadUserProfile(db, decoded.uid);
  const isAdmin = profile?.role === "admin";
  const hasBibliotecaAccess = isAdmin || !!profile?.libraryAccess;

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isBibliotecaRoute && !hasBibliotecaAccess) {
    return NextResponse.redirect(new URL("/pagamento", request.url));
  }

  if (isLoginRoute) {
    const target = "/painel";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/biblioteca",
    "/biblioteca/:path*",
    "/admin/:path*",
    "/painel",
    "/painel/:path*",
    "/criar",
    "/criar/:path*",
    "/login",
  ],
};
