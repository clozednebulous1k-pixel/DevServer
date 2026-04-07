"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function ContatoPage() {
  const screenSize = useScreenSize();

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
      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-28">
        <section className="rounded-3xl border bg-card/70 p-8 backdrop-blur">
          <h1 className="mb-2 text-3xl font-semibold md:text-4xl">Fale com a DevServer</h1>
          <p className="mb-8 text-muted-foreground">
            Vamos transformar sua ideia em um sistema profissional e pronto para vender.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <GlowCard
              glowColor="green"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10">
                <MessageCircle className="mb-2 size-5 text-primary" />
                <h2 className="font-medium">WhatsApp</h2>
                <p className="text-sm text-muted-foreground">Atendimento rápido para orçamento.</p>
              </div>
            </GlowCard>
            <GlowCard
              glowColor="blue"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10">
                <Mail className="mb-2 size-5 text-primary" />
                <h2 className="font-medium">E-mail</h2>
                <p className="text-sm text-muted-foreground">Propostas e detalhes técnicos.</p>
              </div>
            </GlowCard>
            <GlowCard
              glowColor="purple"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10">
                <Phone className="mb-2 size-5 text-primary" />
                <h2 className="font-medium">Consultoria estratégica</h2>
                <p className="text-sm text-muted-foreground">Diagnóstico técnico e plano de execução.</p>
              </div>
            </GlowCard>
          </div>
          <div className="mt-8">
            <Button
              className="rounded-full"
              onClick={() =>
                window.open(
                  "https://wa.me/5511952025568?text=Ol%C3%A1%2C%20quero%20solicitar%20um%20or%C3%A7amento%20com%20a%20DevServer.",
                  "_blank",
                )
              }
            >
              Solicitar Orçamento
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
