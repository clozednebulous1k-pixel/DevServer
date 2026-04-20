import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { loadUserProfile } from "@/lib/auth/load-profile";
import { verifySessionFromRequest } from "@/lib/auth/verify-session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { decoded } = await verifySessionFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ authenticated: false });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({
      authenticated: true,
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: "user",
      libraryAccess: false,
    });
  }

  const profile = await loadUserProfile(db, decoded.uid);

  return NextResponse.json({
    authenticated: true,
    uid: decoded.uid,
    email: decoded.email ?? null,
    role: profile?.role ?? "user",
    libraryAccess: !!profile?.libraryAccess,
  });
}
