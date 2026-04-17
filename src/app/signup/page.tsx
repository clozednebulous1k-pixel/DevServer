"use client";

import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";

export default function SignUpPage() {
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
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 pb-12 pt-28">
        <section className="w-full rounded-3xl border bg-card/80 p-6 text-center backdrop-blur md:p-8">
          <h1 className="text-2xl font-semibold">Cadastro fechado</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Os logins sao criados manualmente pelo admin no Supabase.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Se voce ja comprou a biblioteca, fale com a DevServer para receber seu acesso.
          </p>
        </section>
      </main>
    </div>
  );
}
