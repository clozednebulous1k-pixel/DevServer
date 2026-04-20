"use client";

import { useEffect, useMemo } from "react";
import { signOut } from "firebase/auth";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function LogoutPage() {
  const auth = useMemo(() => getFirebaseAuth(), []);

  useEffect(() => {
    const runLogout = async () => {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
      if (auth) {
        await signOut(auth).catch(() => undefined);
      }
      window.location.replace("/login");
    };
    void runLogout();
  }, [auth]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 pt-28">
        <div className="rounded-2xl border bg-card/80 p-6 text-center">
          <h1 className="text-xl font-semibold">Saindo...</h1>
          <p className="mt-2 text-sm text-muted-foreground">Encerrando sua sessão com segurança.</p>
          <Button className="mt-4 rounded-full" onClick={() => (window.location.href = "/login")}>
            Ir para login
          </Button>
        </div>
      </main>
    </div>
  );
}
