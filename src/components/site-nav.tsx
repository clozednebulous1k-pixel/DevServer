"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, BriefcaseBusiness, HomeIcon, Rocket, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteNav() {
  const navItems = [
    { name: "Início", url: "/", icon: HomeIcon },
    { name: "Sobre", url: "/sobre", icon: User },
    { name: "Projetos", url: "/projetos", icon: BriefcaseBusiness },
    { name: "Biblioteca", url: "/biblioteca", icon: BookOpen },
    { name: "Contato", url: "/contato", icon: Rocket },
  ];

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
