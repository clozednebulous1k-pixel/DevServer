"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, ChevronLeft, Container, Globe, ListChecks, Lock, Monitor, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfraDockerVpsGuide } from "@/components/prompts/infra-docker-vps-guide";

export type PromptCategoryNavItem = {
  id: string;
  label: string;
  count: number;
  soon?: boolean;
};

/** Badge na sidebar: quatro trilhas (Website, Software, Produto & QA, Docker & VPS). */
export const SECURITY_ENV_CHECKS_COUNT = 4;

type SecurityGuideId = "website" | "software" | "product" | "infra" | null;

/** Checklist alinhada a boas práticas OWASP, headers HTTP, cookies, privacidade e hardening comum de front. */
const websiteSteps: readonly { title: string; body: string }[] = [
  {
    title: "TLS/HTTPS e tráfego",
    body: "Use TLS 1.2+ em produção; desative protocolos legados. Redirecione todo HTTP para HTTPS. Evite conteúdo misto (recursos HTTP em página HTTPS). Renove certificados a tempo; considere OCSP stapling onde a CA permitir.",
  },
  {
    title: "HSTS e política de transporte",
    body: "Envie Strict-Transport-Security com max-age adequado; use includeSubDomains e preload só se souber o impacto em todos os subdomínios. Evite que aplicações aceitem credenciais em HTTP claro.",
  },
  {
    title: "CSP, Permissions-Policy e MIME",
    body: "Content-Security-Policy restritiva (default-src, script-src, frame-ancestors, object-src 'none', base-uri). Permissions-Policy para recursos sensíveis (câmera, geolocalização, microfone). X-Content-Type-Options: nosniff. Remova X-Powered-By e cabeçalhos que vazam stack.",
  },
  {
    title: "Clickjacking, abertura e redirecionamentos",
    body: "frame-ancestors (CSP) ou X-Frame-Options para impedir embedding malicioso. Valide URLs em redirecionamentos pós-login (open redirect). Use rel=\"noopener noreferrer\" em links externos quando abrir nova aba.",
  },
  {
    title: "Referrer, CORS e exposição de API",
    body: "Referrer-Policy consistente (ex.: strict-origin-when-cross-origin). Em APIs chamadas pelo browser: CORS com origens explícitas - nunca combine Access-Control-Allow-Origin: * com credenciais. Não exponha endpoints internos ou documentação admin sem autenticação.",
  },
  {
    title: "Cookies e sessão no navegador",
    body: "Cookies de sessão: Secure, HttpOnly, SameSite=Lax ou Strict conforme o fluxo. Evite armazenar refresh tokens de longa duração em localStorage se o risco de XSS for relevante; prefira httpOnly + rotação no servidor. Proteção contra fixação de sessão ao elevar privilégio.",
  },
  {
    title: "XSS, DOM e templates",
    body: "Escape saída por contexto (HTML, JS, URL). Evite dangerouslySetInnerHTML e innerHTML com dados do usuário. Sanitize HTML rico com allowlist (DOMPurify ou equivalente). CSP com nonce/hash reduz impacto de XSS.",
  },
  {
    title: "CSRF e formulários",
    body: "Para mudanças de estado com cookie de sessão, use tokens anti-CSRF (synchronizer ou double submit) além de SameSite. Valide método HTTP, Content-Type e origem quando fizer sentido. Rate limit em login, reset de senha e cadastro.",
  },
  {
    title: "Injeção e validação no servidor",
    body: "Toda entrada passa por validação no backend (formato, tamanho, tipo). Queries parametrizadas; ORM sem concatenar SQL. Cuidado com OS command injection, SSTI e path traversal em uploads/downloads. Limite tamanho do corpo da requisição.",
  },
  {
    title: "Upload de arquivos e conteúdo rico",
    body: "Validar tipo real (magic bytes), extensão, tamanho e armazenar fora da raiz web servível. Nomes de arquivo imprevisíveis; antivírus/scan se o risco exigir. Não confiar só no Content-Type do cliente.",
  },
  {
    title: "Autenticação, senhas e recuperação",
    body: "Política de senha forte; hash só no servidor (Argon2/bcrypt). MFA quando possível. Fluxo de “esqueci senha” sem enumerar contas; rate limit e token de uso único com expiração curta. Mensagens de erro genéricas no login.",
  },
  {
    title: "JWT e tokens no front (se usar)",
    body: "Access token curto; refresh com rotação e revogação no servidor. Valide iss, aud, exp, algoritmo (evite \"none\"). Não coloque dados sensíveis no payload JWT (é legível). Armazene com o mesmo rigor que sessão.",
  },
  {
    title: "Dependências, SRI e terceiros",
    body: "npm/yarn/pnpm audit em CI; atualize CVE críticos. Subresource Integrity em scripts de CDN. Inventário de tags de terceiros (analytics, ads); carregue o mínimo. Verifique subprocessoras para LGPD.",
  },
  {
    title: "Segredos, build e repositório",
    body: "Nenhuma chave privada no repositório ou no bundle público. NEXT_PUBLIC_* / variáveis públicas só para o que pode ser exposto. .env no .gitignore; use secrets no provedor de deploy. Revogue chaves vazadas.",
  },
  {
    title: "Erros, logs e superfície",
    body: "Em produção, não exponha stack traces ao usuário. Páginas 404/500 neutras. Arquivo security.txt na raiz com canal responsável. Desative directory listing e métodos HTTP desnecessários (TRACE).",
  },
  {
    title: "WAF, rate limit e bots",
    body: "Camada de CDN/WAF para padrões comuns de ataque. Rate limiting por IP/usuário em endpoints sensíveis. Proteção a brute force e credential stuffing (CAPTCHA só se necessário, preferir limites e MFA).",
  },
  {
    title: "SSRF e chamadas server-side",
    body: "Se o servidor busca URLs fornecidas pelo usuário (webhooks, pré-visualização, importação), use allowlist de hosts, bloqueie IPs internos/metadata cloud e timeouts curtos.",
  },
  {
    title: "LGPD, privacidade e consentimento",
    body: "Política de privacidade clara; bases legais; minimização e retenção definida. Consentimento quando exigido; canal para titular (acesso, correção, exclusão, portabilidade). Registro de operações de tratamento (ROPA) quando aplicável. DPA com subprocessadores.",
  },
];

/** Checklist cobrindo OWASP API Top 10, ASVS em alto nível, infra, supply chain e operações. */
const softwareSteps: readonly { title: string; body: string }[] = [
  {
    title: "Gestão de segredos e configuração",
    body: "Cofre de secrets (Vault, cloud KMS) ou variáveis injetadas no runtime - nunca no Git. Rotação periódica; revogação imediata após vazamento. Configuração por ambiente separada; desative debug e stack traces em produção.",
  },
  {
    title: "Autenticação e credenciais",
    body: "Hash Argon2/bcrypt com parâmetros atuais; nunca MD5/SHA1 para senhas. MFA para contas privilegiadas. Política de senha e bloqueio progressivo contra brute force. Sessão com timeout e invalidação no logout; proteção a session fixation.",
  },
  {
    title: "Autorização e controle de acesso",
    body: "RBAC/ABAC explícito em cada endpoint; negue por padrão. Teste IDOR/BOLA (acesso a recurso de outro usuário). Separe papéis admin. Não confie só em IDs sequenciais ou ocultos na URL.",
  },
  {
    title: "Injeção (SQL, NoSQL, LDAP, OS)",
    body: "Consultas parametrizadas ou ORM seguro; nunca concatenar entrada em SQL. Sanitize entradas em queries NoSQL/LDAP. Evite shell=True; use listas de argumentos. Validar ordem e tipo de deserialização (pickle, YAML unsafe, etc.).",
  },
  {
    title: "XXE, SSRF e resolução de nomes",
    body: "Desabilite entidades externas em parsers XML. Para HTTP saída iniciada por usuário: allowlist de destinos, bloqueio de ranges privados/link-local, sem redirecionamento automático para file://. Timeouts e limites de tamanho.",
  },
  {
    title: "Mass assignment e validação de entrada",
    body: "DTOs com allowlist de campos; nunca ligar body JSON direto ao modelo persistido sem filtrar. Validar esquema (tamanho, formato, enum). Normalizar Unicode e tratar upload multipart com limites.",
  },
  {
    title: "Criptografia em trânsito e em repouso",
    body: "TLS 1.2+ com cipher suites modernas; HSTS no serviço. Disco e backups criptografados quando o dado exigir. Use bibliotecas padrão (NaCl, libsodium) para novos desenvolvimentos; não invente cifra custom.",
  },
  {
    title: "Banco de dados, backups e disponibilidade",
    body: "Usuário de aplicação com least privilege (sem DROP, sem superuser). Backups automáticos, cifrados, fora do mesmo site; teste de restauração documentado. Replicação e RPO/RTO alinhados ao negócio.",
  },
  {
    title: "APIs REST/GraphQL e limites",
    body: "Autenticação forte (OAuth2/OIDC bem implementado); escopos mínimos. Rate limiting, paginação e tamanho máximo de payload. GraphQL: limites de profundidade/custo e desabilitar introspection em produção se não for necessário.",
  },
  {
    title: "Webhooks e integrações",
    body: "Assine payloads (HMAC) e valide timestamp para evitar replay. HTTPS obrigatório; verifique certificado do parceiro. Idempotência em endpoints que recebem eventos duplicados.",
  },
  {
    title: "Logs, auditoria e privacidade",
    body: "Logs estruturados sem senhas, tokens completos ou dados clínicos desnecessários. Retenção e anonimização conforme LGPD. Trilha de auditoria para ações administrativas. Proteção contra log injection (newline em entrada).",
  },
  {
    title: "Supply chain e build",
    body: "Lockfile versionado; SCA em CI (Dependabot, Snyk, etc.). Revisar scripts postinstall. Assinatura de commits ou imagens quando o processo permitir. SBOM para componentes críticos.",
  },
  {
    title: "Containers e infraestrutura",
    body: "Imagens mínimas (distroless/alpine com cuidado), usuário não-root, read-only root filesystem quando possível. Scan de imagem em CI. Segredos via orchestrator, não na imagem. Network policies / security groups restritivos.",
  },
  {
    title: "Rede, bastion e administração",
    body: "Firewall default deny; só portas necessárias. SSH com chaves, sem senha root; Fail2ban ou equivalente. Bastion/VPN para acesso a produção. Segmentação entre app, DB e filas.",
  },
  {
    title: "Filas, workers e jobs",
    body: "Autenticação entre serviços (mTLS ou tokens de curta duração). Filas privadas; consumidores validam payload. Dead-letter e idempotência. Limites de reprocessamento para evitar loops.",
  },
  {
    title: "Desktop, mobile e updates",
    body: "Assinatura de binários e updates por canal HTTPS com verificação de integridade. Auto-update com assinatura verificada. Armazenamento local cifrado quando guardar credenciais (Keychain/Keystore). Ofuscação não substitui criptografia.",
  },
  {
    title: "Testes, SAST/DAST e resposta a incidentes",
    body: "Testes de segurança no SDLC; SAST/DAST periódicos ou pentest para releases grandes. Plano de resposta a incidentes: contatos, isolamento, preservação de evidências, comunicação legal (LGPD notificação à ANPD quando aplicável).",
  },
];

/** SaaS, monetização, Postgres/Supabase RLS, QA de segurança e entrega com foco (ex.: GSD). */
const productQaSteps: readonly { title: string; body: string }[] = [
  {
    title: "Acesso a conteúdo pago (ex.: biblioteca)",
    body: "Decisão só no servidor ou edge (middleware, API, RLS): flag de assinatura ou entitlement vindo de webhook do PSP. Nunca confie em “usuário disse que pagou” no front. Revogue acesso se assinatura expirar ou chargeback.",
  },
  {
    title: "Autenticação: prefira IdP pronto",
    body: "Evite implementar login completo do zero. Use serviços maduros: Clerk, Keycloak, Casdoor, Authentik, Auth0, Supabase Auth, etc. Eles cobrem fluxos, recuperação de senha, MFA e boa parte de ameaças comuns - você integra e customiza políticas.",
  },
  {
    title: "Postgres / Supabase: RLS o mais restritivo possível",
    body: "Padrão negar tudo; crie policies mínimas por tabela/ação. Não permita que o cliente atualize colunas sensíveis (ex.: library_access, role) via PostgREST - só leitura da própria linha ou updates via Service Role em backend confiável. Revise `anon` vs `authenticated` em cada policy.",
  },
  {
    title: "Banco e segredos: nada exposto",
    body: "Connection string e service_role só em servidor/CI. Não publique URL do painel do DB na internet; use IP allowlist/VPN se possível. Variáveis de ambiente por ambiente; rotação de chaves. Backups fora da mesma conta com acesso restrito.",
  },
  {
    title: "Mass assignment e regras de negócio",
    body: "DTO com allowlist de campos; nunca persistir o body JSON inteiro no modelo. Regras de negócio críticas (preço, desconto, papel, cancelamento) só no servidor e repetidas na camada que grava no banco. Teste casos de borda e abuso.",
  },
  {
    title: "IDOR e permissão por recurso",
    body: "Sempre valide `resource_id` pertence ao `user_id` autenticado (ou ao tenant). Teste com dois usuários e Postman/cURL trocando IDs. UUID ajuda contra enumeração fácil, mas não substitui checagem de ownership.",
  },
  {
    title: "Limites de input em todas as camadas",
    body: "maxLength no HTML, validação no gateway/API, CHECK ou constraint no SQL e limite de body (413). Igual para uploads (tamanho, tipo, contagem). Reduz DoS, armazenamento indevido e payloads maliciosos.",
  },
  {
    title: "Race conditions, pagamento e reembolso",
    body: "Use idempotency-key no provedor de pagamento; webhooks com assinatura e deduplicação por event_id. Reembolso: fluxo autenticado, confirme titularidade, estado explícito (máquina de estados), trava otimista ou transação ao debitar crédito. Teste concorrência (dois cliques, retry de rede).",
  },
  {
    title: "Validação e contratos",
    body: "Esquema versionado (OpenAPI/Zod): tipos, ranges, enums. Mesmas regras no front (UX) e no back (fonte da verdade). Mensagens de erro que não vazem estrutura interna.",
  },
  {
    title: "Fluxo estruturado, testes e “get it done”",
    body: "Divida o sistema em sessões/fluxos (cadastro, checkout, biblioteca, admin…). Para cada um: casos de teste felizes + abuso; checklist de segurança antes de merge. Entregas pequenas com definição de pronto que inclua teste automatizado ou manual registrado.",
  },
  {
    title: "Testes de segurança recorrentes",
    body: "Inclua na suíte: IDOR, CSRF onde couber, rate limit, sessão expirada, replay de webhook, tentativa de escalar role. Em CI: SCA de dependências; opcionalmente DAST em ambiente de staging.",
  },
];

export function LibraryCatalogPanel({
  categories,
  onPickCategory,
}: {
  categories: readonly PromptCategoryNavItem[];
  onPickCategory: (id: string) => void;
}) {
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
              Acesso exclusivo para assinantes com plano ativo (ou administradores). Todas as categorias de prompts
              estão aqui - escolha uma para ver pré-visualizações e copiar o texto para sua IA ou equipe.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={cn(
              "flex flex-col rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm",
              cat.soon && "opacity-80",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">{cat.label}</h3>
              {!cat.soon && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {cat.count}
                </span>
              )}
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {cat.soon
                ? "Em breve na biblioteca."
                : `${cat.count} ${cat.count === 1 ? "item" : "itens"} disponíveis.`}
            </p>
            {cat.soon ? (
              <Button type="button" variant="secondary" size="sm" className="mt-4 w-full rounded-full" disabled>
                Em breve
              </Button>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecurityCheckPanel() {
  const [open, setOpen] = useState<SecurityGuideId>(null);

  const steps =
    open === "website"
      ? websiteSteps
      : open === "software"
        ? softwareSteps
        : open === "product"
          ? productQaSteps
          : null;
  const title =
    open === "website"
      ? "Website"
      : open === "software"
        ? "Software"
        : open === "product"
          ? "Produto & QA"
          : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Deixe seu sistema mais seguro</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quatro trilhas: web, backend/infra, produto (pagamentos, RLS, testes) e laboratório Docker/VPS com passos
              animados. Não substitui auditoria formal nem normas do seu setor.
            </p>
          </div>
        </div>
      </div>

      {!open && (
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setOpen("website")}
            className={cn(
              "group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm transition-colors",
              "hover:border-primary/40 hover:bg-card",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Globe className="size-6" aria-hidden />
            </span>
            <span className="text-lg font-semibold">Website</span>
            <span className="text-sm text-muted-foreground">
              TLS, HSTS, CSP, cookies, XSS/CSRF, CORS, uploads, JWT, SRI, WAF, SSRF server-side, LGPD e hardening de
              deploy.
            </span>
            <span className="mt-1 inline-flex items-center text-sm font-medium text-primary">
              Abrir passo a passo
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen("software")}
            className={cn(
              "group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm transition-colors",
              "hover:border-primary/40 hover:bg-card",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Monitor className="size-6" aria-hidden />
            </span>
            <span className="text-lg font-semibold">Software</span>
            <span className="text-sm text-muted-foreground">
              Segredos, authz, injeção, SSRF/XXE, APIs e webhooks, criptografia, DB, containers, rede, supply chain,
              incident response e apps instaláveis.
            </span>
            <span className="mt-1 inline-flex items-center text-sm font-medium text-primary">
              Abrir passo a passo
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen("product")}
            className={cn(
              "group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card/80 p-6 text-left shadow-sm transition-colors",
              "hover:border-primary/40 hover:bg-card",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <ListChecks className="size-6" aria-hidden />
            </span>
            <span className="text-lg font-semibold">Produto &amp; QA</span>
            <span className="text-sm text-muted-foreground">
              Biblioteca paga, IdP (Clerk, Keycloak, Casdoor, Authentik), RLS estrito, IDOR, mass assignment, limites de
              input, race em pagamento/reembolso, testes por fluxo.
            </span>
            <span className="mt-1 inline-flex items-center text-sm font-medium text-primary">
              Abrir passo a passo
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen("infra")}
            className={cn(
              "group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-card via-card to-cyan-500/[0.07] p-6 text-left shadow-sm transition-all",
              "hover:border-primary/40 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            >
              <span className="absolute -right-8 -top-8 size-32 rounded-full bg-cyan-400/15 blur-2xl" />
            </span>
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <Container className="size-6" aria-hidden />
            </span>
            <span className="relative text-lg font-semibold">Docker &amp; VPS</span>
            <span className="relative text-sm text-muted-foreground">
              Laboratório imersivo: trilhas Docker e servidor, barra de progresso, comandos e navegação passo a passo.
            </span>
            <span className="relative mt-1 inline-flex items-center text-sm font-medium text-cyan-600 dark:text-cyan-400">
              Entrar no laboratório
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      )}

      {open === "infra" && <InfraDockerVpsGuide onBack={() => setOpen(null)} />}

      {open && open !== "infra" && steps && title && (
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(null)}
          >
            <ChevronLeft className="size-4" />
            Voltar às opções
          </Button>

          <div className="rounded-2xl border border-border bg-card/80 p-5 md:p-6">
            <h3 className="text-base font-semibold md:text-lg">Passo a passo - {title}</h3>
            <ol className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold tabular-nums text-primary"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-medium leading-tight">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" />
        <p>
          Este guia é informativo. Para dados sensíveis (saúde, financeiro), consulte regras da ANVISA, BACEN ou LGPD e
          considere assessoria jurídica e testes de segurança (pentest) quando fizer sentido.
        </p>
      </div>
    </div>
  );
}
