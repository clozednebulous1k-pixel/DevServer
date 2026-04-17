import { SiteNav } from "@/components/site-nav";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export default async function AdminOrcamentosPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-28">
          <h1 className="text-3xl font-semibold md:text-4xl">Painel Admin - Orcamentos</h1>
          <p className="mt-3 text-sm text-destructive">
            Supabase nao configurado no ambiente.
          </p>
        </main>
      </div>
    );
  }
  const { data } = await supabase
    .from("orcamentos")
    .select("id, full_name, email, whatsapp, project_type, budget_range, desired_deadline, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const orcamentos = (data ?? []) as Orcamento[];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-28">
        <h1 className="text-3xl font-semibold md:text-4xl">Painel Admin - Orcamentos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Lista de solicitacoes enviadas sem login.
        </p>

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
              {orcamentos.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-muted-foreground" colSpan={7}>
                    Nenhum orcamento recebido ainda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
