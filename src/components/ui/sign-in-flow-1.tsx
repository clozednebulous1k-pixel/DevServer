"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

interface SignInFlowProps {
  initialMode?: AuthMode;
  className?: string;
}

export function SignInFlow({ initialMode = "login", className }: SignInFlowProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginAsCompany, setLoginAsCompany] = useState(false);
  const [signupAsCompany, setSignupAsCompany] = useState(false);
  const router = useRouter();

  return (
    <GlowCard
      glowColor="blue"
      customSize
      className={cn("h-auto w-full max-w-md rounded-3xl border-0 bg-card/70 p-6 backdrop-blur", className)}
    >
      <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            mode === "login" ? "bg-background text-foreground shadow" : "text-muted-foreground",
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            mode === "signup" ? "bg-background text-foreground shadow" : "text-muted-foreground",
          )}
        >
          Sign Up
        </button>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {mode === "login" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <h1 className="text-2xl font-semibold">Entrar na sua conta</h1>
            <p className="text-sm text-muted-foreground">Acesse seu painel e continue seu projeto.</p>
            <input
              type="email"
              required
              placeholder="E-mail"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <input
              type="password"
              required
              placeholder="Senha"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={loginAsCompany}
                onChange={(e) => setLoginAsCompany(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Entrar como empresa
            </label>
            <Button type="submit" className="w-full rounded-full">
              Login
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Nao tem conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <h1 className="text-2xl font-semibold">Criar sua conta</h1>
            <p className="text-sm text-muted-foreground">Cadastre-se para solicitar e acompanhar projetos.</p>
            <input
              type="text"
              required
              placeholder="Nome completo"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <input
              type="email"
              required
              placeholder="E-mail"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <input
              type="password"
              required
              placeholder="Senha"
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={signupAsCompany}
                onChange={(e) => setSignupAsCompany(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Cadastrar como empresa
            </label>
            <Button type="submit" className="w-full rounded-full">
              Sign Up
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Ja tem conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </GlowCard>
  );
}
