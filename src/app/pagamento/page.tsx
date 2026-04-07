"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, QrCode, ShieldCheck } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { Button } from "@/components/ui/button";

export default function PagamentoPage() {
  const params = useSearchParams();
  const planName = params.get("plano") || "Plano";
  const baseValue = Number(params.get("valor") || "68");

  const screenSize = useScreenSize();
  const [billing, setBilling] = useState<"mensal" | "anual">("mensal");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pixReady, setPixReady] = useState(false);
  const [copied, setCopied] = useState(false);

  const monthlyValue = baseValue;
  const yearlyValue = baseValue * 10;
  const selectedValue = billing === "mensal" ? monthlyValue : yearlyValue;
  const yearlyMonthlyAverage = (yearlyValue / 12).toFixed(2).replace(".", ",");

  const pixCode = `00020126360014BR.GOV.BCB.PIX0114devserver@pix520400005303986540${selectedValue
    .toFixed(2)
    .replace(".", "")}5802BR5920DEVSERVER SOLUCOES6009SAO PAULO62070503***6304A1B2`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    `${pixCode}|${payerName}|${payerPhone}|${billing}|${planName}`,
  )}`;

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

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-14 pt-28">
        <section className="rounded-3xl border bg-card/70 p-6 backdrop-blur md:p-8">
          <h1 className="text-3xl font-semibold md:text-4xl">Pagamento via Pix</h1>
          <p className="mt-2 text-muted-foreground">
            Plano selecionado: <strong>{planName}</strong>. Mensal: <strong>R$ {monthlyValue.toFixed(2)}</strong> | Anual:{" "}
            <strong>R$ {yearlyValue.toFixed(2)}</strong> (media de R$ {yearlyMonthlyAverage}/mes).
          </p>

          <form
            className="mt-6 grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!acceptedTerms) return;
              setPixReady(true);
            }}
          >
            <Field label="Nome completo" required>
              <input
                type="text"
                required
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Seu nome"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Telefone" required>
              <input
                type="tel"
                required
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="h-11 w-full rounded-xl border bg-background/80 px-3 text-sm outline-none ring-primary/20 focus:ring-2"
              />
            </Field>

            <Field label="Ciclo de cobranca" required>
              <div className="grid h-11 grid-cols-2 rounded-xl border bg-background/80 p-1">
                <button
                  type="button"
                  onClick={() => setBilling("mensal")}
                  className={`rounded-lg text-sm font-medium transition ${billing === "mensal" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBilling("anual")}
                  className={`rounded-lg text-sm font-medium transition ${billing === "anual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Anual
                </button>
              </div>
            </Field>

            <label className="md:col-span-2 flex items-start gap-2 rounded-xl border bg-background/60 p-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                Ao confirmar sua assinatura, voce concorda com os Termos de Uso da DevServer e autoriza cobrancas
                recorrentes de acordo com os termos. Voce pode cancelar a renovacao automatica a qualquer momento.
              </span>
            </label>

            <div className="md:col-span-2 flex items-center gap-3">
              <Button type="submit" size="lg" className="rounded-full">
                <QrCode className="mr-2 h-4 w-4" />
                Gerar QR Code Pix
              </Button>
              <span className="text-sm text-muted-foreground">Transacao segura e criptografada</span>
            </div>
          </form>

          {pixReady && (
            <div className="mt-6 grid gap-5 rounded-2xl border bg-background/60 p-5 md:grid-cols-[280px_1fr]">
              <div className="flex flex-col items-center gap-3">
                <img src={qrSrc} alt="QR Code Pix DevServer" className="h-[260px] w-[260px] rounded-xl border" />
                <p className="text-xs text-muted-foreground">Valor: R$ {selectedValue.toFixed(2).replace(".", ",")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium">Pix copia e cola</p>
                  <div className="rounded-xl border bg-card p-3 text-xs break-all text-muted-foreground">{pixCode}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-full"
                    onClick={async () => {
                      await navigator.clipboard.writeText(pixCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1600);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar codigo Pix
                  </Button>
                  {copied && <span className="text-sm text-primary">Copiado!</span>}
                </div>
                <div className="rounded-xl border bg-card p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Resumo</p>
                  <p className="mt-1">Plano: {planName}</p>
                  <p>Ciclo: {billing === "mensal" ? "Mensal" : "Anual"}</p>
                  <p>Nome: {payerName}</p>
                  <p>Telefone: {payerPhone}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Powered by DevServer Pay
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-primary">*</span> : null}
      </span>
      {children}
    </label>
  );
}
