"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Blend,
  BookOpen,
  BriefcaseBusiness,
  HomeIcon,
  LayoutPanelTop,
  LogIn,
  LogOut,
  Rocket,
  ShieldCheck,
  User,
} from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

const SESSION_CACHE_KEY = "devserver.nav.session";

type MeResponse = {
  authenticated: boolean;
  role?: "admin" | "user";
};

type NavSessionState = {
  status: "loading" | "authenticated" | "guest";
  role?: "admin" | "user";
};

let navSessionMemoryCache: NavSessionState | null = null;

function readCachedSession(): NavSessionState | null {
  if (navSessionMemoryCache) return navSessionMemoryCache;
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as NavSessionState;
    if (!parsed || (parsed.status !== "authenticated" && parsed.status !== "guest")) return null;
    navSessionMemoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function cacheSession(state: NavSessionState) {
  navSessionMemoryCache = state;
  if (typeof window === "undefined") return;

  if (state.status === "loading") {
    window.sessionStorage.removeItem(SESSION_CACHE_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(state));
}

export function SiteNav() {
  const [session, setSession] = useState<NavSessionState>(() => readCachedSession() ?? { status: "loading" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: MeResponse) => {
        if (cancelled) return;
        const nextState: NavSessionState = data.authenticated
          ? { status: "authenticated", role: data.role }
          : { status: "guest" };
        setSession(nextState);
        cacheSession(nextState);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = readCachedSession() ?? { status: "guest" as const };
        setSession(fallback);
        cacheSession(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = useMemo(() => {
    const publicItems = [
      { name: "Início", url: "/", icon: HomeIcon },
      { name: "Sobre", url: "/sobre", icon: User },
      { name: "Projetos", url: "/projetos", icon: BriefcaseBusiness },
      { name: "Contato", url: "/contato", icon: Rocket },
    ];

    if (session.status === "authenticated") {
      const items = [
        ...publicItems,
        { name: "Biblioteca", url: "/biblioteca", icon: BookOpen },
        { name: "Animacoes", url: "/animacoes", icon: Blend },
        { name: "Painel", url: "/painel", icon: LayoutPanelTop },
      ];
      if (session.role === "admin") {
        items.push({ name: "Admin", url: "/admin/orcamentos", icon: ShieldCheck });
      }
      return items;
    }

    if (session.status === "loading") {
      return [...publicItems, { name: "Painel", url: "/painel", icon: LayoutPanelTop }];
    }

    return [...publicItems, { name: "Entrar", url: "/login", icon: LogIn }];
  }, [session.status, session.role]);

  return (
    <>
      <Link
        href="/"
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 shadow-sm backdrop-blur"
      >
        <Image
          src="/devserver-logo.png"
          alt="DevServer"
          width={20}
          height={20}
          className="h-5 w-5 object-contain dark:invert dark:brightness-200"
        />
        <span className="text-sm font-medium">DevServer</span>
      </Link>
      <NavBar items={navItems} />
      {session.status === "authenticated" ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 sm:bottom-auto sm:left-[calc(50%+360px)] sm:top-6 sm:translate-x-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-border bg-background/90 backdrop-blur"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="mr-1 size-4" />
            Sair
          </Button>
        </div>
      ) : null}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      {showLogoutModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-xl">
            <h2 className="text-lg font-semibold">Confirmar saída</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja sair da sua conta agora?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={() => {
                  setShowLogoutModal(false);
                  cacheSession({ status: "guest" });
                  window.location.href = "/logout";
                }}
              >
                Sim, sair
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
