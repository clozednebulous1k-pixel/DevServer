"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, Lock, Shield, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PromptCategoryNavItem = {
  id: string;
  label: string;
  count: number;
  soon?: boolean;
};

type SecurityStatus = "pass" | "warn" | "fail";

type CheckResult = {
  id: string;
  title: string;
  description: string;
  status: SecurityStatus;
  detail?: string;
};

function runSecurityChecks(): CheckResult[] {
  const results: CheckResult[] = [];

  const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.endsWith(".local"));

  const https = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureContext = typeof window !== "undefined" && window.isSecureContext;

  results.push({
    id: "transport",
    title: "Conexão criptografada (HTTPS)",
    description: "Dados em trânsito devem usar TLS em produção.",
    status: https || isLocal ? "pass" : "fail",
    detail: isLocal
      ? "Ambiente local — em produção use HTTPS."
      : https
        ? "Protocolo HTTPS ativo."
        : "Sem HTTPS neste endereço.",
  });

  results.push({
    id: "secure-context",
    title: "Contexto seguro do navegador",
    description: "APIs sensíveis (clipboard, criptografia) exigem contexto seguro.",
    status: secureContext ? "pass" : "warn",
    detail: secureContext ? "isSecureContext = true." : "Algumas APIs podem estar bloqueadas. Prefira HTTPS.",
  });

  results.push({
    id: "cookies",
    title: "Cookies habilitados",
    description: "Sessões e preferências costumam depender de cookies.",
    status: typeof navigator !== "undefined" && navigator.cookieEnabled ? "pass" : "warn",
    detail:
      typeof navigator !== "undefined" && navigator.cookieEnabled
        ? "navigator.cookieEnabled = true."
        : "Cookies desativados podem quebrar login.",
  });

  let storageOk = true;
  let storageDetail = "localStorage disponível.";
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const k = "__devserver_sec_test__";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
    }
  } catch {
    storageOk = false;
    storageDetail = "localStorage bloqueado (modo privado ou política do navegador).";
  }
  results.push({
    id: "storage",
    title: "Armazenamento local",
    description: "Apps web frequentemente usam localStorage/sessionStorage.",
    status: storageOk ? "pass" : "warn",
    detail: storageDetail,
  });

  results.push({
    id: "online",
    title: "Conectividade",
    description: "Verifica se o navegador relata estar online.",
    status: typeof navigator !== "undefined" && navigator.onLine ? "pass" : "warn",
    detail:
      typeof navigator !== "undefined" && navigator.onLine
        ? "navigator.onLine = true."
        : "Modo offline ou rede instável.",
  });

  results.push({
    id: "scope",
    title: "Escopo desta verificação",
    description: "Checagens locais do navegador — não substituem auditoria de servidor, LGPD ou pentest.",
    status: "warn",
    detail: "Use HTTPS, headers de segurança (CSP, HSTS), WAF e revisão de código em produção.",
  });

  return results;
}

/** Mantém o badge da sidebar alinhado a `runSecurityChecks().length`. */
export const SECURITY_ENV_CHECKS_COUNT = runSecurityChecks().length;

function statusIcon(status: SecurityStatus) {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="size-5 shrink-0 text-emerald-500" aria-hidden />;
    case "fail":
      return <ShieldAlert className="size-5 shrink-0 text-destructive" aria-hidden />;
    default:
      return <HelpCircle className="size-5 shrink-0 text-amber-500" aria-hidden />;
  }
}

export function LibraryCatalogPanel({
  categories,
  onPickCategory,
}: {
  categories: readonly PromptCategoryNavItem[];
  onPickCategory: (id: string) => void;
}) {
  const items = categories.filter((c) => !c.soon);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Conteúdo disponível</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha uma categoria para ver os prompts, pré-visualizações e copiar o texto para sua IA ou equipe.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{cat.label}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {cat.count}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {cat.count} {cat.count === 1 ? "item" : "itens"} na biblioteca.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4 w-full rounded-full"
              onClick={() => onPickCategory(cat.id)}
            >
              Ver conteúdo
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecurityCheckPanel() {
  const [checks, setChecks] = useState<CheckResult[] | null>(null);

  useEffect(() => {
    setChecks(runSecurityChecks());
  }, []);

  const summary = checks
    ? {
        pass: checks.filter((c) => c.status === "pass").length,
        warn: checks.filter((c) => c.status === "warn").length,
        fail: checks.filter((c) => c.status === "fail").length,
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Verificação rápida do ambiente</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Indicadores locais do seu navegador e desta página. Não é um laudo de segurança nem varre seu
                servidor.
              </p>
            </div>
          </div>
          {summary && (
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                OK: {summary.pass}
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                Atenção: {summary.warn}
              </span>
              {summary.fail > 0 && (
                <span className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                  Crítico: {summary.fail}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {!checks && (
        <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
          Executando verificações…
        </div>
      )}

      {checks && (
        <ul className="space-y-3">
          {checks.map((c) => (
            <li
              key={c.id}
              className={cn(
                "flex gap-3 rounded-2xl border p-4",
                c.status === "pass" && "border-emerald-500/20 bg-emerald-500/[0.04]",
                c.status === "warn" && "border-amber-500/20 bg-amber-500/[0.06]",
                c.status === "fail" && "border-destructive/30 bg-destructive/[0.06]",
              )}
            >
              <div className="pt-0.5">{statusIcon(c.status)}</div>
              <div className="min-w-0 flex-1">
                <p className="font-medium leading-tight">{c.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                {c.detail && <p className="mt-2 text-xs text-muted-foreground/90">{c.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>
          Para um sistema real, revise também autenticação, permissões, backup, logs, dependências (npm audit),
          segredos em variáveis de ambiente e conformidade (ex.: LGPD para dados de saúde).
        </p>
      </div>
    </div>
  );
}
