import { SiteNav } from "@/components/site-nav";
import { getAdminDb } from "@/lib/firebase/admin";
import { AccessManager } from "@/components/admin/access-manager";
import { loadUsersDirectory, type DirectoryUser } from "@/lib/admin/users-directory";

type Orcamento = {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string | null;
  project_type: string;
  budget_range: string;
  desired_deadline: string;
  created_at: string;
};

/** Nao pre-renderizar no build: evita falha se Firestore API estiver desativada no GCP. */
export const dynamic = "force-dynamic";

function firestoreHelpMessage(err: unknown, projectId: string | undefined): string {
  const text = err instanceof Error ? err.message : String(err);
  if (text.includes("SERVICE_DISABLED") || text.includes("firestore.googleapis.com")) {
    const pid = projectId ?? "SEU_PROJECT_ID";
    return `A API Cloud Firestore esta desativada no Google Cloud. Ative e aguarde alguns minutos: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=${pid} — No Firebase Console, crie o banco (Firestore) se ainda nao existir.`;
  }
  return "Nao foi possivel carregar orcamentos. Tente novamente em instantes.";
}

export default async function AdminOrcamentosPage() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const db = getAdminDb();
  if (!db) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-28">
          <h1 className="text-3xl font-semibold md:text-4xl">Painel Admin - Orcamentos</h1>
          <p className="mt-3 text-sm text-destructive">
            Firebase Admin / Firestore nao configurado no ambiente.
          </p>
        </main>
      </div>
    );
  }

  let orcamentos: Orcamento[] = [];
  let initialUsers: DirectoryUser[] = [];
  let loadError: string | null = null;

  try {
    const snap = await db.collection("orcamentos").orderBy("createdAt", "desc").limit(200).get();

    orcamentos = snap.docs.map((doc) => {
      const row = doc.data() as {
        full_name?: string;
        email?: string;
        whatsapp?: string;
        project_type?: string;
        budget_range?: string;
        desired_deadline?: string;
        createdAt?: { toDate?: () => Date };
      };

      const createdAt = row.createdAt?.toDate?.() ?? new Date();

      return {
        id: doc.id,
        full_name: row.full_name ?? "",
        email: row.email ?? "",
        whatsapp: row.whatsapp ?? null,
        project_type: row.project_type ?? "",
        budget_range: row.budget_range ?? "",
        desired_deadline: row.desired_deadline ?? "",
        created_at: createdAt.toISOString(),
      };
    });

    initialUsers = (await loadUsersDirectory()) ?? [];
  } catch (err) {
    loadError = firestoreHelpMessage(err, projectId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-28">
        <h1 className="text-3xl font-semibold md:text-4xl">Painel Admin - Orcamentos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lista de solicitacoes enviadas sem login.
        </p>

        {loadError ? (
          <p className="mt-4 max-w-3xl rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </p>
        ) : null}

        <div className="mt-6 overflow-x-auto rounded-2xl border bg-card/80">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">WhatsApp</th>
                <th className="px-4 py-3">Projeto</th>
                <th className="px-4 py-3">Faixa</th>
                <th className="px-4 py-3">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">{item.full_name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.whatsapp || "-"}</td>
                  <td className="px-4 py-3">{item.project_type}</td>
                  <td className="px-4 py-3">{item.budget_range}</td>
                  <td className="px-4 py-3">{item.desired_deadline}</td>
                </tr>
              ))}
              {!loadError && orcamentos.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>
                    Nenhum orcamento recebido ainda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <AccessManager initialUsers={initialUsers} />
      </main>
    </div>
  );
}
