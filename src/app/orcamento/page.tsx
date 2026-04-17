"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { ClipboardList, Clock3, FileText, PhoneCall } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OrcamentoPage() {
  const screenSize = useScreenSize();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(false);
    setErrorMessage(null);
    setSending(true);
    if (!supabase) {
      setSending(false);
      setErrorMessage("Envio indisponivel: configure o Supabase no ambiente.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      full_name: String(formData.get("full_name") ?? ""),
      email: String(formData.get("email") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      company: String(formData.get("company") ?? ""),
      project_type: String(formData.get("project_type") ?? ""),
      budget_range: String(formData.get("budget_range") ?? ""),
      desired_deadline: String(formData.get("desired_deadline") ?? ""),
      start_date: String(formData.get("start_date") ?? ""),
      project_goal: String(formData.get("project_goal") ?? ""),
      desired_features: String(formData.get("desired_features") ?? ""),
      references_url: String(formData.get("references_url") ?? ""),
      additional_notes: String(formData.get("additional_notes") ?? ""),
    };

    const { error } = await supabase.from("orcamentos").insert(payload);
    setSending(false);

    if (error) {
      setErrorMessage("Falha ao enviar. Tente novamente em alguns instantes.");
      return;
    }

    event.currentTarget.reset();
    setSent(true);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="pointer-events-none fixed inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 34 : 56}
          fadeDuration={500}
          delay={0}
          pixelClassName="rounded-sm bg-primary/25"
        />
      </div>

      <SiteNav />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-14 pt-28">
        <section className="mb-6 text-center">
          <h1 className="text-3xl font-semibold md:text-5xl">Solicitar Orçamento</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Preencha os dados do seu projeto. Quanto mais detalhes, mais precisa fica nossa proposta.
          </p>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <GlowCard glowColor="green" customSize className="rounded-2xl border-0 bg-card/70 p-4">
            <div className="relative z-10">
              <ClipboardList className="mb-2 size-5 text-primary" />
              <h2 className="text-sm font-medium">Escopo claro</h2>
              <p className="mt-1 text-xs text-muted-foreground">Detalhes técnicos e objetivos do projeto.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="blue" customSize className="rounded-2xl border-0 bg-card/70 p-4">
            <div className="relative z-10">
              <Clock3 className="mb-2 size-5 text-primary" />
              <h2 className="text-sm font-medium">Prazo realista</h2>
              <p className="mt-1 text-xs text-muted-foreground">Planejamento por fases e entregas.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="purple" customSize className="rounded-2xl border-0 bg-card/70 p-4">
            <div className="relative z-10">
              <FileText className="mb-2 size-5 text-primary" />
              <h2 className="text-sm font-medium">Proposta completa</h2>
              <p className="mt-1 text-xs text-muted-foreground">Custo, cronograma e próximos passos.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="green" customSize className="rounded-2xl border-0 bg-card/70 p-4">
            <div className="relative z-10">
              <PhoneCall className="mb-2 size-5 text-primary" />
              <h2 className="text-sm font-medium">Contato rápido</h2>
              <p className="mt-1 text-xs text-muted-foreground">Retorno para alinhar dúvidas.</p>
            </div>
          </GlowCard>
        </section>

        <section className="rounded-3xl border bg-card/70 p-6 backdrop-blur md:p-8">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <Field label="Nome completo" required>
              <input
                name="full_name"
                type="text"
                required
                placeholder="Seu nome"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>
            <Field label="E-mail" required>
              <input
                name="email"
                type="email"
                required
                placeholder="voce@empresa.com"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="WhatsApp">
              <input
                name="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>
            <Field label="Empresa">
              <input
                name="company"
                type="text"
                placeholder="Nome da empresa (opcional)"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Tipo de projeto" required>
              <select
                name="project_type"
                required
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                <option>Landing Page</option>
                <option>Site Institucional</option>
                <option>Sistema Web</option>
                <option>E-commerce</option>
                <option>App Mobile</option>
                <option>Outro</option>
              </select>
            </Field>
            <Field label="Faixa de orçamento" required>
              <select
                name="budget_range"
                required
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione uma faixa
                </option>
                <option>Até R$ 5.000</option>
                <option>R$ 5.000 a R$ 15.000</option>
                <option>R$ 15.000 a R$ 30.000</option>
                <option>Acima de R$ 30.000</option>
              </select>
            </Field>

            <Field label="Prazo desejado" required>
              <select
                name="desired_deadline"
                required
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione o prazo
                </option>
                <option>Urgente (até 15 dias)</option>
                <option>Curto (30 dias)</option>
                <option>Médio (60 dias)</option>
                <option>Sem prazo definido</option>
              </select>
            </Field>
            <Field label="Data ideal de início">
              <input
                name="start_date"
                type="date"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Objetivo do projeto" className="md:col-span-2" required>
              <textarea
                name="project_goal"
                required
                rows={4}
                placeholder="Ex.: captar leads, vender online, automatizar processos..."
                className="w-full rounded-xl border bg-background/80 px-3 py-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Funcionalidades desejadas" className="md:col-span-2" required>
              <textarea
                name="desired_features"
                required
                rows={5}
                placeholder="Ex.: login, painel admin, integração com pagamento, chatbot, relatórios..."
                className="w-full rounded-xl border bg-background/80 px-3 py-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Referências (links)" className="md:col-span-2">
              <input
                name="references_url"
                type="url"
                placeholder="https://..."
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Observações adicionais" className="md:col-span-2">
              <textarea
                name="additional_notes"
                rows={4}
                placeholder="Conte qualquer detalhe importante para nossa equipe..."
                className="w-full rounded-xl border bg-background/80 px-3 py-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <div className="md:col-span-2 flex flex-col items-start gap-3 pt-2">
              <Button type="submit" size="lg" className="rounded-full" disabled={sending}>
                {sending ? "Enviando..." : "Enviar solicitação"}
              </Button>
              {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
              {sent && (
                <p className="text-sm text-primary">
                  Solicitação enviada com sucesso! Vamos retornar seu contato em breve.
                </p>
              )}
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}
