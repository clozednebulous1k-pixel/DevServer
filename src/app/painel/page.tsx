import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PainelPageClient } from "@/components/painel/painel-page-client";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { getAdminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const auth = getAdminAuth();
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!auth || !sessionCookie) {
    redirect("/login?redirect=/painel");
  }

  try {
    await auth.verifySessionCookie(sessionCookie, true);
  } catch {
    redirect("/login?redirect=/painel");
  }

  return <PainelPageClient />;
}
