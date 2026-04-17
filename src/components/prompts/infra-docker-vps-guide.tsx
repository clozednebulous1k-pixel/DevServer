"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Container,
  Copy,
  type LucideIcon,
  HardDrive,
  KeyRound,
  Layers,
  Network,
  Server,
  Ship,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Track = "docker" | "vps";

type InfraStep = {
  title: string;
  body: string;
  command?: string;
  icon: LucideIcon;
};

const dockerSteps: InfraStep[] = [
  {
    title: "Instale o Docker",
    body: "No Windows/macOS use Docker Desktop; no Linux instale o pacote oficial (docker-ce) do repositório da distribuição. Reinicie a sessão para o grupo `docker` aplicar sem `sudo` onde for suportado.",
    icon: Ship,
  },
  {
    title: "Valide a instalação",
    body: "Confirme cliente e daemon com `docker version`. Rode o hello-world para garantir pull e execução de container pública.",
    command: "docker run --rm hello-world",
    icon: Terminal,
  },
  {
    title: "Entenda imagem vs container",
    body: "Imagem é o artefato imutável (camadas). Container é a instância em execução (ou parada) criada a partir da imagem. Você versiona o Dockerfile no Git, não o container efêmero.",
    icon: Layers,
  },
  {
    title: "Escreva um Dockerfile mínimo",
    body: "FROM define a base; WORKDIR a pasta de trabalho; COPY traz o código; RUN instala dependências; EXPOSE documenta portas; CMD ou ENTRYPOINT inicia o processo. Multi-stage reduz tamanho final em apps Node/Go.",
    icon: Box,
  },
  {
    title: "Build e tag",
    body: "Construa com contexto na pasta do Dockerfile. Use tags semânticas (`:1.2.0`) além de `latest` para rastrear o que está em produção.",
    command: "docker build -t minha-app:1.0 .",
    icon: Container,
  },
  {
    title: "Run: portas e variáveis",
    body: "Mapeie `-p host:container`, injete segredos com `-e` ou `--env-file` (nunca commitar `.env`). `--rm` remove o container ao sair — útil em dev.",
    command: "docker run --rm -p 3000:3000 --env-file .env minha-app:1.0",
    icon: Network,
  },
  {
    title: "Docker Compose",
    body: "Orquestre app + banco + cache em `compose.yaml`. `docker compose up -d` sobe em segundo plano; volumes nomeados persistem dados; networks isolam serviços.",
    command: "docker compose up -d --build",
    icon: HardDrive,
  },
  {
    title: "Logs, debug e registry",
    body: "`docker compose logs -f serviço` acompanha saída. `docker exec -it` abre shell dentro do container. Publique imagens em GHCR/Docker Hub e puxe na VPS com digest fixo quando possível.",
    icon: Terminal,
  },
];

const vpsSteps: InfraStep[] = [
  {
    title: "Escolha o provedor e o plano",
    body: "Hetzner, DigitalOcean, Linode, AWS Lightsail, etc. Região próxima aos usuários; IPv4 estável; backup opcional no painel. Gere par de chaves SSH no seu computador (`ssh-keygen -t ed25519`).",
    icon: Cloud,
  },
  {
    title: "Primeiro acesso por SSH",
    body: "Cole a chave pública no painel ao criar o servidor. Conecte com `ssh root@IP`. Troque senha padrão se o provedor entregou uma; desative login por senha depois de validar chaves.",
    command: "ssh -i ~/.ssh/id_ed25519 root@SEU_IP",
    icon: KeyRound,
  },
  {
    title: "Atualize o sistema e usuário",
    body: "`apt update && apt upgrade -y` (Debian/Ubuntu). Crie usuário não-root com `sudo`, copie `authorized_keys` e desabilite SSH direto do root quando estiver confortável.",
    icon: Server,
  },
  {
    title: "Firewall (UFW) básico",
    body: "Permita SSH antes de `ufw enable`. Abra só 22, 80 e 443 se for web. IPv6 também se usar. Fail2ban reduz brute force em SSH.",
    command: "ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable",
    icon: Network,
  },
  {
    title: "Instale o Docker na VPS",
    body: "Siga a documentação oficial Docker para sua distro (convenience script ou repo apt). Adicione o usuário deploy ao grupo `docker` ou use root só para bootstrap.",
    icon: Ship,
  },
  {
    title: "Leve o código ou a imagem",
    body: "Opção A: `git clone` + `docker compose up -d` na VPS. Opção B: `docker pull` da registry com tag fixa. Nunca deixe `.env` no repositório — use variáveis no servidor ou secrets do provedor.",
    icon: Container,
  },
  {
    title: "Proxy reverso e TLS",
    body: "Nginx ou Caddy na frente dos containers; termina TLS com Let's Encrypt (certbot ou Caddy automático). Apenas o proxy escuta 443; app fica em rede interna ou localhost.",
    icon: Layers,
  },
  {
    title: "Operação contínua",
    body: "Monitore disco e RAM (`docker system df`). Atualize imagens base regularmente. Backup de volumes e do banco fora da mesma máquina. Documente o comando de restore.",
    icon: HardDrive,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 28 } },
};

export function InfraDockerVpsGuide({ onBack }: { onBack: () => void }) {
  const [track, setTrack] = useState<Track>("docker");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = track === "docker" ? dockerSteps : vpsSteps;
  const total = steps.length;

  const safeIndex = useMemo(() => Math.min(activeIndex, total - 1), [activeIndex, total]);

  const progress = ((safeIndex + 1) / total) * 100;

  useEffect(() => {
    setCopied(false);
  }, [safeIndex, track]);

  function switchTrack(next: Track) {
    setTrack(next);
    setActiveIndex(0);
  }

  const step = steps[safeIndex]!;
  const StepIcon = step.icon;

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1 rounded-full text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        <ChevronLeft className="size-4" />
        Voltar às opções
      </Button>

      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.08] shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_24px_48px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_48px_-12px_rgba(0,0,0,0.5)]">
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-cyan-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 p-5 md:p-8">
          <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">Laboratório</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">Docker &amp; VPS</h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Ambiente guiado: alterne entre trilhas, avance os passos e copie comandos. Ideal para subir seu
                primeiro stack com sensação de terminal futurista.
              </p>
            </div>
            <div className="flex shrink-0 rounded-2xl border border-border/80 bg-background/40 p-1 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => switchTrack("docker")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  track === "docker"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Ship className="size-4" aria-hidden />
                Docker
              </button>
              <button
                type="button"
                onClick={() => switchTrack("vps")}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  track === "vps"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Server className="size-4" aria-hidden />
                VPS
              </button>
            </div>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="mt-2 text-right text-xs tabular-nums text-muted-foreground">
            Passo {safeIndex + 1} / {total}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${track}-${safeIndex}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="relative rounded-2xl border border-border/80 bg-background/50 p-6 shadow-inner backdrop-blur-md md:p-8"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-primary via-primary/50 to-cyan-500/80" />
                <div className="pl-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                      <StepIcon className="size-6" aria-hidden />
                    </span>
                    <h4 className="text-lg font-semibold leading-snug md:text-xl">{step.title}</h4>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{step.body}</p>
                  {step.command ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 }}
                      className="mt-5 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="h-8 rounded-lg text-xs"
                          onClick={async () => {
                            await navigator.clipboard.writeText(step.command!);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1600);
                          }}
                        >
                          <Copy className="mr-1 size-3.5" />
                          {copied ? "Copiado" : "Copiar comando"}
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-xl border border-primary/20 bg-black/80 px-4 py-3 font-mono text-xs text-primary-foreground/95 md:text-sm">
                        {step.command}
                      </pre>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-3 lg:pt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Roteiro</p>
              <motion.ol
                className="flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1 [scrollbar-gutter:stable]"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                key={track}
              >
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const active = i === safeIndex;
                  return (
                    <motion.li key={s.title} variants={itemVariants} className="list-none">
                      <button
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                          active
                            ? "border-primary/50 bg-primary/10 text-foreground shadow-md ring-1 ring-primary/25"
                            : "border-transparent bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums",
                            active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 pt-0.5">
                          <span className="flex items-center gap-2 font-medium leading-tight">
                            <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                            {s.title}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ol>

              <div className="mt-auto flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="flex-1 rounded-xl"
                  disabled={safeIndex <= 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 rounded-xl"
                  disabled={safeIndex >= total - 1}
                  onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
                >
                  Próximo
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
