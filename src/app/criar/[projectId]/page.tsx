import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditorShell } from "@/components/criar/editor-shell";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { getAdminAuth } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ projectId: string }> };

export default async function CriarProjectPage({ params }: PageProps) {
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

  const { projectId } = await params;
  return <EditorShell projectId={projectId} />;
}
