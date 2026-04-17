"use client";

import { Activity, Cloud, Database, Globe2, type LucideIcon, Server, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

const topics: {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
}[] = [
  {
    icon: Globe2,
    title: "Sites e front (Jamstack)",
    summary: "Deploy contínuo a partir do Git, SSL automático e escala de leitura.",
    bullets: [
      "Vercel, Netlify ou Cloudflare Pages para Next.js/React estático ou SSR edge.",
      "Variáveis de ambiente só no painel do provedor — nunca chaves privadas no repositório.",
      "Preview por branch para validar antes de ir para produção.",
    ],
    accent: "from-sky-500/20 to-transparent",
  },
  {
    icon: Server,
    title: "VPS e servidor próprio",
    summary: "Controle total da máquina; você cuida de SO, firewall e patches.",
    bullets: [
      "Hetzner, DigitalOcean, AWS Lightsail, Linode: escolha região perto do público.",
      "SSH com chave, usuário não-root, UFW ou security group só com portas necessárias.",
      "Atualize o sistema e monitore disco/RAM; snapshot antes de mudanças grandes.",
    ],
    accent: "from-violet-500/20 to-transparent",
  },
  {
    icon: Ship,
    title: "Docker na prática",
    summary: "Mesmo app em dev e produção; upgrades com rollback simples.",
    bullets: [
      "Imagem versionada + `docker compose up -d` na VPS ou runner próprio.",
      "Proxy reverso (Nginx/Caddy) na frente do container; TLS com Let's Encrypt.",
      "Limites de CPU/memória no compose para evitar que um serviço derrube o host.",
    ],
    accent: "from-cyan-500/20 to-transparent",
  },
  {
    icon: Database,
    title: "Banco de dados",
    summary: "Prefira gerenciado para menos operação ou durável na VPS com backup.",
    bullets: [
      "Supabase, Neon, PlanetScale, RDS: backups e alta disponibilidade embutidos.",
      "Se o DB fica na mesma VPS do app, isole rede e não exponha a porta 5432 na internet.",
      "Teste restauração de backup pelo menos uma vez por trimestre.",
    ],
    accent: "from-emerald-500/20 to-transparent",
  },
  {
    icon: Cloud,
    title: "DNS, CDN e TLS",
    summary: "Performance e segurança na borda antes do tráfego chegar na origem.",
    bullets: [
      "Cloudflare ou similar: DNS, cache estático, WAF básico, proteção DDoS leve.",
      "HTTPS obrigatório; redirecione HTTP → HTTPS e use HSTS quando estável.",
      "Separe subdomínios (api., app., cdn.) para facilitar regras e certificados.",
    ],
    accent: "from-amber-500/15 to-transparent",
  },
  {
    icon: Activity,
    title: "Observabilidade e continuidade",
    summary: "Saiba quando algo cai e tenha plano de recuperação.",
    bullets: [
      "Logs centralizados ou `docker logs`; alertas de disco cheio e 5xx.",
      "Healthcheck no compose e no balanceador para retirar instância ruim do pool.",
      "Documente: onde está o código, como fazer deploy e quem acorda se cair à noite.",
    ],
    accent: "from-rose-500/15 to-transparent",
  },
];

export const HOSTING_TOPIC_COUNT = topics.length;

export function HostingPanel() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.06] p-5 md:p-7">
        <div
          className="pointer-events-none absolute -right-16 top-0 size-48 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/90">Guia DevServer</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">Onde e como hospedar</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Visão prática para escolher camadas de hospedagem: do site estático ao stack com banco e containers. Combine
          opções conforme orçamento, time de ops e necessidade de compliance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <article
              key={t.title}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md",
              )}
            >
              <div
                className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80", t.accent)}
                aria-hidden
              />
              <div className="relative">
                <span className="flex size-11 items-center justify-center rounded-xl bg-background/80 text-primary ring-1 ring-border">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
