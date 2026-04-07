"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function SobrePage() {
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
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28">
        <section className="rounded-3xl border bg-card/70 p-8 backdrop-blur">
          <div className="mb-6 flex items-center gap-4">
            <Image
              src="/devserver-logo.png"
              alt="DevServer"
              width={72}
              height={72}
              className="h-16 w-16 object-contain dark:invert dark:brightness-200"
            />
            <h1 className="text-3xl font-semibold md:text-4xl">Sobre a DevServer</h1>
          </div>
          <p className="mb-6 text-muted-foreground">
            Somos uma software house focada em criar sistemas modernos para empresas que querem vender mais, automatizar processos e escalar com segurança.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <GlowCard
              glowColor="green"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <p>Arquitetura limpa e escalável para crescimento de longo prazo.</p>
              </div>
            </GlowCard>
            <GlowCard
              glowColor="blue"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <p>UI premium focada em credibilidade e conversão de vendas.</p>
              </div>
            </GlowCard>
            <GlowCard
              glowColor="purple"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <p>Performance alta para SEO, ads e experiência do usuário.</p>
              </div>
            </GlowCard>
            <GlowCard
              glowColor="orange"
              customSize
              className="h-full w-full rounded-xl border-0 bg-card/60 p-4"
            >
              <div className="relative z-10 flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <p>Stack profissional com tecnologias de mercado.</p>
              </div>
            </GlowCard>
          </div>
        </section>
      </main>
    </div>
  );
}
