"use client";

import { FormEvent, useMemo, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function LoginPage() {
  const screenSize = useScreenSize();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const redirect =
    requestedRedirect && requestedRedirect.startsWith("/") ? requestedRedirect : "/painel";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useMemo(() => getFirebaseAuth(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    if (!auth) {
      setLoading(false);
      setError("Login indisponivel: configure o Firebase no ambiente.");
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();
      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, remember }),
      });

      if (!sessionResponse.ok) {
        setError("Nao foi possivel criar sessao. Tente novamente.");
        setLoading(false);
        return;
      }

      router.replace(redirect);
      router.refresh();
    } catch {
      setError("Nao foi possivel entrar. Verifique email e senha.");
    }

    setLoading(false);
  }

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
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 pb-12 pt-28">
        <section className="w-full max-w-md rounded-3xl border bg-card/80 p-6 backdrop-blur md:p-8">
          <h1 className="text-2xl font-semibold">Entrar na DevServer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login para usuario com biblioteca liberada e para administrador.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Senha</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sua senha"
                  className="h-11 w-full rounded-xl border bg-background/80 px-3 pr-11 text-sm outline-none ring-primary/20 focus:ring-2"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="size-4 rounded border border-border accent-primary"
              />
              Lembrar senha
            </label>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
