"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { signOut } from "firebase/auth";
import { LockKeyhole, LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";

type MeResponse = {
  authenticated: boolean;
  role?: "admin" | "user";
  email?: string | null;
  libraryAccess?: boolean;
};

export default function PainelPage() {
  const auth = useMemo(() => getFirebaseAuth(), []);
  const screenSize = useScreenSize();
  const [session, setSession] = useState<MeResponse>({ authenticated: false });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: MeResponse) => {
        if (cancelled) return;
        setSession(data);
      })
      .catch(() => {
        if (cancelled) return;
        setSession({ authenticated: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    if (newPassword.length < 8) {
      setSaving(false);
      setError("A nova senha precisa ter ao menos 8 caracteres.");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Falha ao atualizar senha.");
      }
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Senha atualizada com sucesso.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nao foi possivel atualizar a senha.";
      setError(message);
    }

    setSaving(false);
  }

  async function handleLogout() {
    setError(null);
    setMessage(null);
    await fetch("/api/auth/logout", { method: "POST" });
    if (auth) {
      await signOut(auth).catch(() => undefined);
    }
    window.location.href = "/login";
  }

  const isAdmin = session.role === "admin";

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="pointer-events-none fixed inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 34 : 56}
          fadeDuration={500}
          delay={0}
          pixelClassName="rounded-sm bg-primary/25"
        />
      </div>
      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-28">
        <section className="rounded-3xl border bg-card/80 p-6 backdrop-blur md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Painel da conta</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Gerencie seu acesso e sua senha com segurança.
              </p>
            </div>
            <Button type="button" variant="outline" className="rounded-full" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Sair
            </Button>
          </div>

          <div className={`mt-6 grid gap-4 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            <article className="rounded-2xl border bg-background/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle2 className="size-4" />
                Conta
              </div>
              <p className="text-sm">
                <span className="font-medium">E-mail:</span> {session.email ?? "(carregando...)"}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Perfil:</span> {isAdmin ? "Administrador" : "Usuário"}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Biblioteca:</span>{" "}
                {isAdmin || session.libraryAccess ? "Liberada" : "Bloqueada"}
              </p>
            </article>

            {isAdmin ? (
              <article className="rounded-2xl border bg-background/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="size-4" />
                  Painel administrativo
                </div>
                <p className="text-sm text-muted-foreground">
                  Você pode criar e liberar novos logins no painel de administração.
                </p>
                <Link href="/admin/orcamentos">
                  <Button className="mt-3 rounded-full">Abrir painel admin</Button>
                </Link>
              </article>
            ) : null}
          </div>

          <article id="alterar-senha" className="mt-6 rounded-2xl border bg-background/60 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <LockKeyhole className="size-4" />
              Alterar senha
            </div>

            <form className="grid gap-3 md:grid-cols-2" onSubmit={handleChangePassword}>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Senha atual</span>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  className="h-10 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                  placeholder="Digite sua senha atual"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Nova senha</span>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="h-10 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                  placeholder="Minimo 8 caracteres"
                />
              </label>
              <div className="md:col-span-2">
                <Button type="submit" className="rounded-full" disabled={saving}>
                  {saving ? "Salvando..." : "Atualizar senha"}
                </Button>
              </div>
            </form>

            {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
            {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          </article>
        </section>
      </main>
    </div>
  );
}
