import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PromptLibrary } from "@/components/prompts/prompt-library";
import { loadUserProfile } from "@/lib/auth/load-profile";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export default async function BibliotecaPage() {
  const auth = getAdminAuth();
  const db = getAdminDb();
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!auth || !db || !sessionCookie) {
    redirect("/login?redirect=/biblioteca");
  }

  let decodedUid: string | null = null;
  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    decodedUid = decoded.uid;
  } catch {
    redirect("/login?redirect=/biblioteca");
  }

  const profile = await loadUserProfile(db, decodedUid);
  const isAdmin = profile?.role === "admin";
  const hasBibliotecaAccess = isAdmin || !!profile?.libraryAccess;

  if (!hasBibliotecaAccess) {
    redirect("/pagamento");
  }

  return <PromptLibrary />;
}
