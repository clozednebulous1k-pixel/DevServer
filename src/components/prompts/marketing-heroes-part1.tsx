"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  Rocket,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { HlsVideo } from "@/components/ui/hls-video";
import { VideoFadeMp4 } from "@/components/ui/video-fade-mp4";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

const CF = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";

export function wrap(scale: number, children: React.ReactNode, className?: string) {
  return (
    <div className={cn("relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]", className)}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1400px] max-w-none origin-top"
        style={{ transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/** Stellar.ai - Inter, tabs, vídeo + overlays */
export function StellarAiHeroInner() {
  const [tab, setTab] = useState<"analyse" | "train" | "testing" | "deploy">("analyse");
  useEffect(() => {
    const order = ["analyse", "train", "testing", "deploy"] as const;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % order.length;
      setTab(order[i]!);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "analyse" as const, label: "Analyse", Icon: BarChart3 },
    { id: "train" as const, label: "Train", Icon: BookOpen },
    { id: "testing" as const, label: "Testing", Icon: Users },
    { id: "deploy" as const, label: "Deploy", Icon: Rocket },
  ];

  return (
    <div className="min-h-[920px] bg-white font-[family-name:Inter,sans-serif]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 animate-fade-in-up"
        style={{ opacity: 0, animationDelay: "0.1s" }}
      >
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-black text-black" />
          <span className="text-lg font-semibold">Stellar.ai</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-gray-700 md:flex">
          <button type="button" className="flex items-center gap-1 hover:text-black">
            Solutions <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" className="flex items-center gap-1 hover:text-black">
            For Teams <ChevronDown className="h-4 w-4" />
          </button>
          <span className="hover:text-black">About Us</span>
          <span className="hover:text-black">Learn Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Login</span>
          <button
            type="button"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Get started free
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-32 pt-24 text-center">
        <div
          className="mb-8 inline-flex animate-fade-in-up items-center gap-2"
          style={{ opacity: 0, animationDelay: "0.2s" }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded border border-gray-300">
            <Star className="h-3.5 w-3.5 fill-black" />
          </div>
          <span className="text-sm font-medium text-black">4.9 rating from 18.3K+ users</span>
        </div>
        <h1
          className="mb-5 animate-fade-in-up text-6xl font-normal leading-[1.1] tracking-tight md:text-7xl lg:text-[80px]"
          style={{ opacity: 0, animationDelay: "0.3s" }}
        >
          Work Smarter. Move Faster.
          <br />
          <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
            AI Powers You Up.
          </span>
        </h1>
        <p
          className="mx-auto mb-8 max-w-2xl animate-fade-in-up text-lg text-gray-600 md:text-xl"
          style={{ opacity: 0, animationDelay: "0.4s" }}
        >
          Intelligent automation syncs with the tools you love to streamline tasks, boost output, and save time.
        </p>
        <button
          type="button"
          className="mb-12 animate-fade-in-up rounded-full bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
          style={{ opacity: 0, animationDelay: "0.5s" }}
        >
          Begin Free Trial
        </button>

        <div
          className="mx-auto mb-8 max-w-2xl animate-fade-in-up rounded-lg bg-gray-100 p-1"
          style={{ opacity: 0, animationDelay: "0.6s" }}
        >
          <div className="grid grid-cols-2 gap-1 md:hidden">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-md py-2 text-sm",
                  tab === id ? "bg-white text-black shadow-sm" : "text-gray-600",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          <div className="hidden items-center justify-center gap-0 md:flex">
            {tabs.map(({ id, label, Icon }, idx) => (
              <div key={id} className="flex items-center">
                {idx > 0 && <div className="mx-2 h-5 w-px bg-gray-300" />}
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm",
                    tab === id ? "bg-white text-black shadow-sm" : "text-gray-600",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative mx-auto h-[400px] max-w-5xl animate-fade-in-up overflow-hidden rounded-3xl md:h-[500px]"
          style={{ opacity: 0, animationDelay: "0.7s" }}
        >
          <video
            className="h-full w-full object-cover"
            src={`${CF}/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4`}
            autoPlay
            muted
            playsInline
            loop
          />
          {tab === "analyse" && (
            <div className="animate-fade-in-overlay absolute inset-0 flex items-center justify-center bg-black/20 p-6">
              <div
                className="animate-slide-up-overlay w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%", position: "absolute" }}
              >
                <p className="font-semibold text-gray-900">Set Up Your AI Workspace</p>
                <div className="mt-3 h-2 w-full rounded-full bg-purple-100">
                  <div className="h-full w-1/4 rounded-full bg-purple-600" />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  <li>1. Connect data</li>
                  <li>2. Choose model</li>
                  <li>3. Invite team</li>
                  <li>4. Launch</li>
                </ul>
              </div>
            </div>
          )}
          {tab === "train" && (
            <div className="animate-fade-in-overlay absolute inset-0 flex items-center justify-center bg-black/20 p-6">
              <div
                className="animate-slide-up-overlay absolute max-w-md rounded-2xl bg-white p-6 shadow-xl"
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
              >
                <p className="font-semibold">AI Model Training</p>
                <div className="mt-3 h-2 rounded-full bg-orange-100">
                  <div className="h-full w-2/3 rounded-full bg-orange-500" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <span>Loss: 0.02</span>
                  <span>Epoch: 12</span>
                  <span>GPU: 98%</span>
                  <span>ETA: 4m</span>
                </div>
              </div>
            </div>
          )}
          {tab === "testing" && (
            <div className="animate-fade-in-overlay absolute inset-0 flex items-center justify-center bg-black/20">
              <div
                className="animate-slide-up-overlay absolute max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
              >
                <p className="font-semibold text-green-700">Test Suite Results</p>
                <p className="mt-2 text-3xl font-bold text-green-600">127/127</p>
                <p className="text-sm text-gray-600">All tests passed</p>
              </div>
            </div>
          )}
          {tab === "deploy" && (
            <div className="animate-fade-in-overlay absolute inset-0 flex items-center justify-center bg-black/20">
              <div
                className="animate-slide-up-overlay absolute max-w-md rounded-2xl bg-white p-6 shadow-xl"
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
              >
                <p className="font-semibold">Deploy to Production</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>✓ Build verified</li>
                  <li>✓ Secrets rotated</li>
                  <li>✓ CDN warmed</li>
                  <li>○ Final approval</li>
                </ul>
                <button type="button" className="mt-4 w-full rounded-full bg-black py-2 text-sm text-white">
                  Deploy Now
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className="mt-24 flex animate-fade-in-up flex-wrap items-center justify-center gap-8 text-xs font-semibold tracking-wider text-gray-400"
          style={{ opacity: 0, animationDelay: "0.8s" }}
        >
          <span>INTERSCOPE</span>
          <span>SPOTIFY</span>
          <span>Nexera</span>
          <span className="font-serif italic">M3</span>
          <span>LAURA COLE</span>
          <span>vertex</span>
        </div>
      </section>
    </div>
  );
}

/** Power AI - escuro, vídeo com fade, General Sans */
export function PowerAiHeroInner() {
  return (
    <div
      className="relative min-h-screen text-[hsl(var(--hf-fg))]"
      style={
        {
          "--hf-bg": "260 87% 3%",
          "--hf-fg": "40 6% 95%",
          "--hf-sub": "40 6% 82%",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 overflow-hidden bg-[hsl(260,87%,3%)]">
        <VideoFadeMp4
          src={`${CF}/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]" />
      <div className="relative z-10 flex min-h-screen flex-col font-[family-name:General_Sans,sans-serif]">
        <header className="flex items-center justify-between px-8 py-5">
          <img src="/logo.png" alt="" className="h-8 w-auto opacity-80" width={120} height={32} />
          <nav className="hidden gap-6 text-sm md:flex">
            <button type="button" className="text-[hsl(var(--hf-fg)/0.9)]">Features ▾</button>
            <span>Solutions</span>
            <span>Plans</span>
            <span>Learning ▾</span>
          </nav>
          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[hsl(var(--hf-fg))] backdrop-blur-sm"
          >
            Sign Up
          </button>
        </header>
        <div className="mx-auto mt-[3px] h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-[hsl(var(--hf-fg)/0.2)] to-transparent" />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1
            className="max-w-[95vw] text-[clamp(3rem,12vw,220px)] font-normal leading-[1.02] tracking-[-0.024em]"
          >
            <span className="text-[hsl(var(--hf-fg))]">Power </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
              }}
            >
              AI
            </span>
          </h1>
          <p className="mt-[9px] max-w-md text-lg leading-8 text-[hsl(var(--hf-sub))] opacity-80">
            The most powerful AI ever deployed / in talent acquisition
          </p>
          <button
            type="button"
            className="mt-[25px] rounded-full border border-white/20 bg-white/10 px-[29px] py-[24px] text-sm backdrop-blur-sm"
          >
            Schedule a Consult
          </button>
        </div>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 pb-10 md:flex-row md:justify-between md:gap-12">
          <p className="text-center text-sm text-[hsl(var(--hf-fg)/0.5)] md:text-left">
            Relied on by brands
            <br />
            across the globe
          </p>
          <div className="landing-marquee flex overflow-hidden">
            <div className="landing-marquee-track flex gap-16 pr-16">
              {["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn", "Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"].map(
                (name, idx) => (
                  <div key={`${name}-${idx}`} className="flex shrink-0 items-center gap-3">
                    <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold">
                      {name[0]}
                    </div>
                    <span className="text-base font-semibold text-[hsl(var(--hf-fg))]">{name}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Aethera - vídeo + Instrument Serif */
export function AetheraHeroInner() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-x-0 bottom-0 top-[300px] z-0">
        <VideoFadeMp4
          src={`${CF}/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <span className="font-[family-name:Instrument_Serif,serif] text-3xl tracking-tight text-black">
          Aethera<sup className="text-lg">®</sup>
        </span>
        <div className="hidden gap-8 text-sm md:flex">
          <span className="text-black">Home</span>
          <span className="text-[#6F6F6F]">Studio</span>
          <span className="text-[#6F6F6F]">About</span>
          <span className="text-[#6F6F6F]">Journal</span>
          <span className="text-[#6F6F6F]">Reach Us</span>
        </div>
        <button
          type="button"
          className="rounded-full bg-black px-6 py-2.5 text-sm text-white transition-transform hover:scale-[1.03]"
        >
          Begin Journey
        </button>
      </nav>
      <section
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: "calc(8rem - 75px)", paddingBottom: "10rem" }}
      >
        <h1 className="animate-fade-rise max-w-7xl font-[family-name:Instrument_Serif,serif] text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-black sm:text-7xl md:text-8xl">
          Beyond <em className="not-italic text-[#6F6F6F]">silence,</em> we build{" "}
          <em className="not-italic text-[#6F6F6F]">the eternal.</em>
        </h1>
        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-[#6F6F6F] sm:text-lg">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>
        <button
          type="button"
          className="animate-fade-rise-delay-2 mt-12 rounded-full bg-black px-14 py-5 text-base text-white transition-transform hover:scale-[1.03]"
        >
          Begin Journey
        </button>
      </section>
    </div>
  );
}

/** Rubik NEW ERA */
export function RubikEraHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#21346e]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${CF}/hf_20260206_044704_dd33cb15-c23f-4cfc-aa09-a0465d4dcb54.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 md:pt-48">
        <h1 className="font-[family-name:Rubik,sans-serif] text-6xl font-bold uppercase leading-[0.98] tracking-[-2px] text-white md:text-8xl md:tracking-[-4px] lg:text-[100px]">
          NEW ERA
          <br />
          OF DESIGN
          <br />
          STARTS NOW
        </h1>
        <button
          type="button"
          className="relative mt-10 flex h-[65px] w-[184px] items-center justify-center scale-100 transition-transform hover:scale-105 active:scale-95"
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 184 65" preserveAspectRatio="none">
            <path d="M8 0 H176 Q184 0 184 8 V57 Q184 65 176 65 H8 Q0 65 0 57 V8 Q0 0 8 0 Z" fill="white" />
          </svg>
          <span className="relative z-10 font-[family-name:Rubik,sans-serif] text-[20px] font-bold uppercase text-[#161a20]">
            GET STARTED
          </span>
        </button>
      </div>
    </div>
  );
}
