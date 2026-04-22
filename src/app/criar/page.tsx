import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProjectsDashboard } from "@/components/criar/projects-dashboard";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { getAdminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export default async function CriarPage() {
  const auth = getAdminAuth();
  const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!auth || !sessionCookie) {
    redirect("/login?redirect=/criar");
  }

  try {
    await auth.verifySessionCookie(sessionCookie, true);
  } catch {
    redirect("/login?redirect=/criar");
  }

  return <ProjectsDashboard />;
}
