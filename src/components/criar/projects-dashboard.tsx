"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

type ProjectItem = {
  id: string;
  name: string;
  status: "draft" | "published";
  updatedAt?: string;
};

export function ProjectsDashboard() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    setError(null);
    const response = await fetch("/api/criar/projects", { cache: "no-store" });
    if (!response.ok) throw new Error("Falha ao carregar projetos.");
    const data = (await response.json()) as { projects: ProjectItem[] };
    setProjects(data.projects ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    loadProjects()
      .catch(() => {
        if (cancelled) return;
        setError("Falha ao carregar projetos.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function createProject() {
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/criar/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `Projeto ${new Date().toLocaleDateString("pt-BR")}` }),
      });
      if (!response.ok) throw new Error("Falha ao criar projeto.");
      const data = (await response.json()) as { project: ProjectItem };
      window.location.href = `/criar/${data.project.id}`;
    } catch {
      setError("Não foi possível criar o projeto.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-28">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">CRIAR</h1>
            <p className="text-sm text-muted-foreground">Gerencie projetos e edite landing pages por componentes.</p>
          </div>
          <Button type="button" onClick={createProject} disabled={creating}>
            <Plus className="mr-1 size-4" />
            {creating ? "Criando..." : "Novo projeto"}
          </Button>
        </div>

        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}

        {loading ? (
          <section className="rounded-2xl border bg-card/80 p-6 text-sm text-muted-foreground">Carregando projetos...</section>
        ) : (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="rounded-2xl border bg-card/80 p-4">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">Status: {project.status}</p>
                <p className="text-xs text-muted-foreground">
                  Atualizado: {project.updatedAt ? new Date(project.updatedAt).toLocaleString("pt-BR") : "-"}
                </p>
                <div className="mt-3">
                  <Link href={`/criar/${project.id}`}>
                    <Button type="button" variant="outline">
                      Abrir editor
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
            {projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-card/50 p-6 text-sm text-muted-foreground">
                Nenhum projeto ainda. Clique em &quot;Novo projeto&quot; para começar.
              </div>
            ) : null}
          </section>
        )}
      </main>
    </div>
  );
}
