"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, BriefcaseBusiness, HomeIcon, LayoutPanelTop, LogIn, Rocket, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type MeResponse = {
  authenticated: boolean;
  role?: "admin" | "user";
};

export function SiteNav() {
  const [session, setSession] = useState<MeResponse>({ authenticated: false });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: MeResponse) => {
        if (cancelled) return;
        setSession({ authenticated: !!data.authenticated, role: data.role });
      })
      .catch(() => {
        if (cancelled) return;
        setSession({ authenticated: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const navItems = useMemo(() => {
    const baseItems = [
      { name: "Início", url: "/", icon: HomeIcon },
      { name: "Sobre", url: "/sobre", icon: User },
      { name: "Projetos", url: "/projetos", icon: BriefcaseBusiness },
      { name: "Biblioteca", url: "/biblioteca", icon: BookOpen },
      { name: "Contato", url: "/contato", icon: Rocket },
    ];

    if (session.authenticated) {
      const painelUrl = session.role === "admin" ? "/admin/orcamentos" : "/painel";
      return [...baseItems, { name: "Painel", url: painelUrl, icon: LayoutPanelTop }];
    }

    return [...baseItems, { name: "Entrar", url: "/login", icon: LogIn }];
  }, [session.authenticated, session.role]);

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
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}
