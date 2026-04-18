"use client";

import {
  Archive,
  Database,
  Eye,
  KeyRound,
  Layers,
  Network,
  Server,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const securityTopics: {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
}[] = [
  {
    icon: Shield,
    title: "RLS e permissões mínimas",
    summary: "Cada conexão enxerga só o que precisa - principalmente em Postgres no modelo multi-tenant.",
    bullets: [
      "No Postgres (Supabase, Neon, etc.): habilite RLS e escreva policies explícitas; teste com dois usuários.",
      "Usuário da aplicação sem SUPERUSER, sem CREATE em schemas públicos e sem DROP em produção.",
      "Separe roles: migrador (CI) ≠ runtime da API; senhas rotacionadas se vazarem.",
    ],
    accent: "from-teal-500/18 to-transparent",
  },
  {
    icon: KeyRound,
    title: "Segredos e string de conexão",
    summary: "A URL do banco é credencial tão sensível quanto uma senha de admin.",
    bullets: [
      "Variáveis de ambiente no servidor ou cofre (Vault, Doppler); nunca no front nem no Git.",
      "SSL/TLS obrigatório para o cliente (`sslmode=require`); IP allowlist quando o provedor permitir.",
      "Rotação de senha após incidente; desative usuários legados de integração antiga.",
    ],
    accent: "from-cyan-500/15 to-transparent",
  },
  {
    icon: Network,
    title: "Exposição na rede",
    summary: "O melhor banco inseguro na internet vira alvo em minutos.",
    bullets: [
      "Não publique porta 5432/3306 aberta para 0.0.0.0; use VPC, tunnel SSH ou serviço gerenciado com endpoint privado.",
      "Firewall + bastion para administração humana; 2FA no painel do provedor.",
      "Desative features de debug e `listen_addresses` amplo em VMs próprias.",
    ],
    accent: "from-sky-500/15 to-transparent",
  },
  {
    icon: Archive,
    title: "Backup, criptografia e retenção",
    summary: "Dados em repouso e cópias fora do mesmo rack.",
    bullets: [
      "Backups automáticos com retenção definida; teste restore documentado (RTO/RPO).",
      "Criptografia em disco no provedor; para dados ultra-sensíveis considere colunas cifradas na aplicação.",
      "LGPD: política de retenção e exclusão; logs de auditoria sem senhas em texto puro.",
    ],
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    icon: Eye,
    title: "Auditoria e integridade",
    summary: "Saiba quem mudou o quê e detecte anomalias.",
    bullets: [
      "Triggers ou tabelas de auditoria para campos críticos; horário em UTC.",
      "Migrations versionadas (Prisma, Flyway, Liquibase); nada de `ALTER` manual esquecido em produção.",
      "Alertas de conexões anômalas, picos de CPU e disco cheio antes de parar o serviço.",
    ],
    accent: "from-violet-500/12 to-transparent",
  },
];

/** Tiers orientativos - ordem reflete adoção comum em prod vs prototipagem, não “melhor motor absoluto”. */
const contextTiers: {
  badge: string;
  title: string;
  description: string;
  ranked: string[];
  borderClass: string;
}[] = [
  {
    badge: "Produção OLTP",
    title: "Sistemas transacionais em escala",
    description: "Relacional ACID, ecossistema maduro, equipes e ferramentas abundantes.",
    ranked: [
      "1 · PostgreSQL gerenciado - Neon, Supabase (Postgres), AWS RDS/Aurora Postgres, Azure Flexible, Crunchy Bridge.",
      "2 · MySQL / MariaDB gerenciado - RDS MySQL, Cloud SQL, PlanetScale (MySQL compatível, fluxo serverless).",
      "3 · SQL Server gerenciado - quando o stack corporativo já é Microsoft.",
    ],
    borderClass: "border-teal-500/30 bg-teal-500/[0.04]",
  },
  {
    badge: "Produção + BaaS",
    title: "Auth, storage e APIs prontas",
    description: "Acelera MVP com custo de vendor lock-in e modelo de preço a acompanhar.",
    ranked: [
      "1 · Supabase (Postgres + Auth + Storage + Realtime) - ótimo para web/mobile com RLS bem feita.",
      "2 · Firebase / Firestore - rápido para apps Google; regras de segurança precisam revisão constante.",
      "3 · Appwrite, Convex, PocketBase - avalie self-host vs cloud e limites de escala.",
    ],
    borderClass: "border-amber-500/30 bg-amber-500/[0.05]",
  },
  {
    badge: "Testes e desenvolvimento",
    title: "Barato, rápido de subir e descartável",
    description: "Não use dados reais de clientes; anonimize seeds.",
    ranked: [
      "1 · SQLite ou libSQL (Turso) - zero ops local; Turso para DB por branch em equipes pequenas.",
      "2 · Postgres em Docker Compose - espelha produção; volumes nomeados para não perder estado entre runs.",
      "3 · Bancos em memória (H2, etc.) - só para testes unitários de repositório, nunca como fonte única de verdade.",
    ],
    borderClass: "border-slate-500/30 bg-muted/30",
  },
  {
    badge: "Especialistas",
    title: "Cache, busca, documentos, séries temporais",
    description: "Complementam o OLTP principal - não substituem validação transacional sem desenho explícito.",
    ranked: [
      "Cache / fila: Redis, Valkey, Dragonfly - sessão, rate limit, pub/sub; persistência opcional com cuidado.",
      "Documentos: MongoDB Atlas, Couchbase - quando o modelo de dados é realmente documento-first.",
      "Busca: OpenSearch, Elasticsearch, Meilisearch, Typesense - índices separados da fonte transacional.",
      "Time-series: TimescaleDB, InfluxDB, ClickHouse - métricas, IoT, analytics de alto volume.",
    ],
    borderClass: "border-rose-500/25 bg-rose-500/[0.04]",
  },
];

export const DATABASE_PANEL_SECTION_COUNT =
  securityTopics.length + contextTiers.length;

export function DatabasePanel() {
  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-card via-card to-teal-500/[0.07] p-5 md:p-7">
        <div
          className="pointer-events-none absolute -right-10 top-0 size-44 rounded-full bg-teal-400/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600 dark:text-teal-400">Dados</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">Bancos de dados seguros e quando usar cada um</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Primeiro endureça o acesso, backup e auditoria. Depois escolha o motor pelo tipo de carga - relacional para a
          maioria dos negócios, BaaS para velocidade de produto, e engines especializados só com necessidade clara.
        </p>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Database className="size-5 text-teal-600 dark:text-teal-400" aria-hidden />
          <h3 className="text-lg font-semibold">Segurança em primeiro lugar</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {securityTopics.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className="relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.accent)}
                  aria-hidden
                />
                <div className="relative">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-background/85 text-teal-600 ring-1 ring-border dark:text-teal-400">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h4 className="mt-4 text-base font-semibold leading-snug">{t.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-2 leading-relaxed">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-teal-500/80" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Layers className="size-5 text-teal-600 dark:text-teal-400" aria-hidden />
          <h3 className="text-lg font-semibold">Ranking por contexto (referência prática)</h3>
        </div>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          A ordem dentro de cada bloco sugere o que equipes costumam adotar primeiro naquele cenário. Sempre valide SLA,
          custo, equipe e compliance antes de trocar de motor.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {contextTiers.map((tier) => (
            <div
              key={tier.badge}
              className={cn(
                "flex flex-col rounded-2xl border p-5 shadow-sm backdrop-blur-sm md:p-6",
                tier.borderClass,
              )}
            >
              <span className="w-fit rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                {tier.badge}
              </span>
              <h4 className="mt-3 text-base font-semibold">{tier.title}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
              <ul className="mt-4 list-none space-y-3 text-sm leading-relaxed text-muted-foreground">
                {tier.ranked.map((line) => (
                  <li key={line} className="flex gap-2">
                    <Server className="mt-0.5 size-3.5 shrink-0 text-teal-600/70 dark:text-teal-400/70" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
