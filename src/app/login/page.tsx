"use client";

import { useScreenSize } from "@/components/hooks/use-screen-size";
import { SiteNav } from "@/components/site-nav";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { SignInFlow } from "@/components/ui/sign-in-flow-1";

export default function LoginPage() {
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
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 pb-12 pt-28">
        <SignInFlow initialMode="login" />
      </main>
    </div>
  );
}
