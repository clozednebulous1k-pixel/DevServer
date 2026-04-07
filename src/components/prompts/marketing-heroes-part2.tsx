"use client";

import { memo, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Menu,
  Phone,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import useMeasure from "react-use-measure";
import { HlsVideo } from "@/components/ui/hls-video";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";
import {
  AetheraHeroInner,
  PowerAiHeroInner,
  RubikEraHeroInner,
  StellarAiHeroInner,
  wrap,
} from "./marketing-heroes-part1";

const CF = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";

const WaitlistBtn = ({ dark = true }: { dark?: boolean }) => (
  <span className="relative inline-flex rounded-full p-[0.6px]">
    <span
      className={cn(
        "pointer-events-none absolute -top-1 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-gradient-to-b from-white/40 to-transparent blur-md",
      )}
    />
    <button
      type="button"
      className={cn(
        "relative rounded-full px-[29px] py-[11px] text-sm font-medium",
        dark ? "bg-black text-white" : "bg-white text-black",
      )}
    >
      Join Waitlist
    </button>
  </span>
);

export function Web3EosHeroInner() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${CF}/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-black/50" />
      <header className="relative z-10 flex items-center justify-between px-8 py-5 md:px-[120px] md:py-5">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-tight" style={{ width: 187, fontSize: 14 }}>
            LOGOIPSUM
          </span>
          <nav className="hidden gap-[30px] text-sm font-medium md:flex">
            {["Get Started", "Developers", "Features", "Resources"].map((l) => (
              <button key={l} type="button" className="flex items-center gap-3.5 text-white">
                {l}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            ))}
          </nav>
        </div>
        <WaitlistBtn dark />
      </header>
      <div className="relative z-10 flex min-h-[60vh] flex-col items-center px-6 pb-[102px] pt-[200px] text-center md:pt-[280px]">
        <div className="mb-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium">
          <span className="h-1 w-1 rounded-full bg-white" />
          <span className="text-white/60">Early access available from</span>
          <span>May 1, 2026</span>
        </div>
        <h1
          className="max-w-[613px] text-4xl font-medium leading-[1.28] md:text-[56px]"
          style={{
            background: "linear-gradient(144.5deg, #fff 28%, transparent 115%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Web3 at the Speed of Experience
        </h1>
        <p className="mt-6 max-w-[680px] text-[15px] font-normal text-white/70">
          Powering seamless experiences and real-time connections, EOS is the base for creators who move with purpose, leveraging resilience, speed, and scale to shape the future.
        </p>
        <div className="mt-10">
          <WaitlistBtn dark={false} />
        </div>
      </div>
    </div>
  );
}

const HLS_GLASS = "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8";
const LOGO_SVGS = [
  "https://html.tailus.io/blocks/customers/openai.svg",
  "https://html.tailus.io/blocks/customers/nvidia.svg",
  "https://html.tailus.io/blocks/customers/github.svg",
  "https://html.tailus.io/blocks/customers/openai.svg",
];

export function GlassHlsHeroInner() {
  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-[#010101] text-center text-white">
      <div className="relative z-20 px-6 pt-16">
        <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/10 bg-[rgba(28,27,36,0.15)] px-4 py-2 backdrop-blur-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FA93FA] via-[#C967E8] to-[#983AD6] shadow-[0_0_20px_rgba(201,103,232,0.5)]">
            <Zap className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm text-white/70">Used by founders. Loved by devs.</span>
        </div>
        <h1 className="mt-8 text-5xl font-semibold leading-tight md:text-7xl md:text-[80px]">
          <span className="bg-gradient-to-b from-white to-[#C967E8] bg-clip-text text-transparent">Your Vision</span>
          <br />
          <span className="bg-gradient-to-b from-white to-[#983AD6] bg-clip-text text-transparent">Our Digital Reality.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-white/80">
          We turn bold ideas into modern designs that don&apos;t just look amazing, they grow your business fast.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-6 py-3 text-black shadow-lg backdrop-blur-md"
        >
          Book a 15-min call
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FA93FA] to-[#983AD6] text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </motion.button>
      </div>
      <div className="relative z-10 -mt-[150px] w-full mix-blend-screen">
        <div className="relative">
          <HlsVideo
            src={HLS_GLASS}
            className="h-auto w-full"
            style={{ maxHeight: bounds.width ? bounds.width * 0.45 : 400 }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#010101] via-transparent to-[#010101]" />
        </div>
      </div>
      <div className="relative z-20 border-t border-white/5 bg-black/20 px-6 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center">
          <p className="shrink-0 text-sm text-white/60 md:border-r md:border-white/10 md:pr-8">
            Powering the best teams
          </p>
          <div className="min-w-0 flex-1 overflow-hidden">
            <InfiniteSlider gap={48} speed={40}>
              {LOGO_SVGS.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt="" className="h-8 w-auto shrink-0 brightness-0 invert" />
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GeistMinimalHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans">
      <video
        className="absolute inset-0 h-full w-full object-cover [transform:scaleY(-1)]"
        src={`${CF}/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-white" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6" style={{ paddingTop: 290 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="text-5xl font-medium tracking-[-0.04em] text-[#0a0a0a] md:text-[80px]">
            Simple{" "}
            <span className="font-[family-name:Instrument_Serif,serif] text-6xl italic md:text-[100px]">management</span>{" "}
            for your remote team
          </h1>
        </motion.div>
        <motion.p
          className="mt-8 max-w-[554px] text-lg text-[#373a46]/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          Streamline workflows, async updates, and calm collaboration — without the noise.
        </motion.p>
        <motion.div
          className="mt-10 flex max-w-xl flex-col gap-3 rounded-[40px] border border-black/10 bg-[#fcfcfc] p-2 pl-5 shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)] sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.7 }}
        >
          <input type="email" placeholder="you@company.com" className="min-w-0 flex-1 bg-transparent text-sm outline-none" readOnly />
          <button
            type="button"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
          >
            Create Free Account
          </button>
        </motion.div>
        <p className="mt-4 text-xs text-neutral-500">1,020+ Reviews ★★★★★</p>
      </div>
    </div>
  );
}

const MUX_BUILDER = "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";
const POSTER =
  "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

export function AiBuilderHlsHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <HlsVideo src={MUX_BUILDER} className="h-full w-full object-cover opacity-60" poster={POSTER} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>
      <div className="pointer-events-none absolute -left-[20%] top-[-20%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen" />
      <div className="pointer-events-none absolute -right-[20%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px] mix-blend-screen" />
      <nav className="relative z-50 flex items-center justify-between px-6 py-4">
        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" opacity="0.3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="hidden gap-8 text-sm font-medium text-white/80 md:flex">
          <span className="flex items-center gap-1">
            Products <ChevronDown className="h-4 w-4" />
          </span>
          <span>Customer Stories</span>
          <span>Resources</span>
          <span>Pricing</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm sm:block">Book A Demo</span>
          <button type="button" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">
            Get Started
          </button>
        </div>
      </nav>
      <div className="relative z-10 mx-auto mt-20 flex max-w-5xl flex-col items-center space-y-12 px-6 text-center">
        <motion.p
          className="font-[family-name:Instrument_Serif,serif] text-3xl leading-[1.1] sm:text-5xl lg:text-[48px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Design at the speed of thought
        </motion.p>
        <motion.h1
          className="bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-6xl font-semibold leading-[0.9] tracking-tighter text-transparent sm:text-8xl lg:text-[136px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Build Faster
        </motion.h1>
        <motion.p
          className="max-w-xl text-lg text-white/70 sm:text-[20px] sm:leading-[1.65]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Create fully functional, SEO-optimized websites in seconds with our advanced AI engine.
        </motion.p>
        <motion.div className="flex flex-col items-center gap-6 sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-white py-2 pl-6 pr-2 text-lg font-medium text-[#0a0400] shadow-[0_0_20px_rgba(255,255,255,0.15)] transition hover:scale-105"
          >
            Start Building Free
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3054ff] text-white">
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>
          <button type="button" className="flex items-center gap-2 rounded-lg px-4 py-2 text-white/70 backdrop-blur-sm hover:bg-white/5 hover:text-white">
            See Examples <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export function TasklyGlassHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white antialiased">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#60B1FF]/30 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-[400px] w-[400px] rounded-full bg-[#319AFF]/25 blur-[100px]" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-8">
        <nav className="sticky top-[30px] z-20 mx-auto flex w-fit items-center gap-8 rounded-2xl border border-black/10 bg-white/30 px-6 py-3 shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.25)] backdrop-blur-[50px]">
          <span className="font-[family-name:Fustat,sans-serif] text-xl font-bold">Taskly</span>
          <div className="hidden gap-6 text-sm md:flex">
            <span>Home</span>
            <span>Features</span>
            <span>Company</span>
            <span>Pricing</span>
          </div>
          <button type="button" className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-sm backdrop-blur-sm">
            SignUp <ArrowRight className="h-4 w-4" />
          </button>
        </nav>
        <div className="mt-16 flex flex-col gap-12 lg:flex-row">
          <div className="flex-1 space-y-6 lg:max-w-[52%]">
            <div className="flex gap-1 text-[#FF801E]">★★★★★</div>
            <p className="text-sm text-neutral-600">Rated 4.9/5 by 2700+ customers</p>
            <h1 className="font-[family-name:Fustat,sans-serif] text-5xl font-bold leading-[1.05] tracking-[-2px] md:text-[75px]">
              Work smarter, achieve faster
            </h1>
            <p className="max-w-xl text-lg tracking-[-1px] text-neutral-700">
              Effortlessly manage your projects, collaborate with your team, and achieve your goals with our intuitive task management tool.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 text-white shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.35)] transition hover:scale-[1.02]"
              style={{ background: "rgba(0,132,255,0.8)", backdropFilter: "blur(2px)" }}
            >
              Get Started Now
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center lg:max-w-[48%]">
            <video
              className="max-h-[480px] scale-125 mix-blend-screen object-contain [filter:hue-rotate(-55deg)_saturate(2.5)_brightness(1.2)_contrast(1.1)]"
              src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
              autoPlay
              muted
              playsInline
              loop
            />
          </div>
        </div>
        <p className="mt-24 text-center text-xs text-neutral-400">Trusted by Top-tier product companies — logos placeholder</p>
      </div>
    </div>
  );
}

export function BarlowAgencyHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${CF}/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-[250px] pt-12 text-center text-white">
        <nav className="mb-12 flex justify-between text-sm">
          <span className="font-[family-name:Barlow,sans-serif] font-semibold">STUDIO</span>
          <div className="hidden gap-6 md:flex">
            <span>Work</span>
            <span>About</span>
            <span>Contact</span>
          </div>
        </nav>
        <div className="relative mx-auto inline-flex rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-sm">
          <div className="rounded-full bg-white/90 px-4 py-1.5 text-xs backdrop-blur-md">Featured in Fortune</div>
        </div>
        <div className="relative mt-16">
          <span className="absolute left-0 top-0 h-[7px] w-[7px] bg-white" />
          <span className="absolute right-0 top-0 h-[7px] w-[7px] bg-white" />
          <span className="absolute bottom-0 left-0 h-[7px] w-[7px] bg-white" />
          <span className="absolute bottom-0 right-0 h-[7px] w-[7px] bg-white" />
          <h1 className="px-8 font-[family-name:Barlow,sans-serif] text-5xl font-light md:text-[64px]">
            Agency that makes your
            <br />
            <span className="font-[family-name:Instrument_Serif,serif] italic">videos & reels viral</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-[family-name:Barlow,sans-serif] text-white/75">
            High-impact short-form, performance creative, and always-on content — built for growth teams.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              className="rounded-[2px] border-0 bg-[#f8f8f8] px-8 py-3 font-[family-name:Barlow,sans-serif] font-medium text-[#171717] transition-colors hover:bg-white"
            >
              Book a call
            </button>
            <button
              type="button"
              className="rounded-[2px] border-0 bg-[#f8f8f8] px-8 py-3 font-[family-name:Barlow,sans-serif] font-medium text-[#171717] transition-colors hover:bg-white"
            >
              See reel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BloomGlassHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={`${CF}/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <div className="relative flex w-full flex-col p-6 lg:w-[52%]">
          <div className="liquid-glass-strong absolute inset-4 rounded-3xl lg:inset-6" />
          <div className="relative z-10 flex flex-1 flex-col p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="" width={32} height={32} className="rounded-lg opacity-70" />
                <span className="text-2xl font-semibold tracking-tighter">bloom</span>
              </div>
              <button type="button" className="liquid-glass rounded-full p-2">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" width={80} height={80} className="mb-6 opacity-60" />
              <h1 className="text-5xl font-medium tracking-[-0.05em] lg:text-7xl">
                Innovating the <i className="font-[family-name:Source_Serif_4,serif] font-normal text-white/80">spirit of bloom</i> AI
              </h1>
              <button type="button" className="liquid-glass-strong mt-8 flex items-center gap-3 rounded-full px-6 py-3 transition-transform hover:scale-105 active:scale-95">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <Download className="h-4 w-4" />
                </span>
                Explore Now
              </button>
            </div>
          </div>
        </div>
        <div className="hidden flex-1 flex-col gap-4 p-6 lg:flex lg:w-[48%]">
          <div className="liquid-glass rounded-3xl p-4">
            <p className="text-sm font-medium">Enter our ecosystem</p>
            <p className="mt-2 text-xs text-white/60">Community & drops.</p>
          </div>
          <div className="mt-auto grid gap-4 md:grid-cols-2">
            <div className="liquid-glass flex flex-col gap-2 rounded-3xl p-4">
              <Wand2 className="h-6 w-6" />
              <span className="text-sm font-medium">Processing</span>
            </div>
            <div className="liquid-glass flex flex-col gap-2 rounded-3xl p-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium">Growth Archive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const clipTargo: CSSProperties = {
  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

export function TargoHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-[family-name:Rubik,sans-serif] text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={`${CF}/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4`}
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="relative z-10 px-8 py-8 md:px-16">
        <header className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-[-0.04em]">targo</span>
          <nav className="hidden gap-6 text-sm md:flex">
            <span>Home</span>
            <span>About</span>
            <span>Contact Us</span>
          </nav>
          <button type="button" className="px-4 py-2 text-xs font-semibold text-white" style={{ background: "#EE3F2C", ...clipTargo }}>
            Contact
          </button>
        </header>
        <div className="mt-24 max-w-xl">
          <h1 className="text-[42px] font-bold uppercase leading-tight tracking-[-0.04em] md:text-[64px]">
            Swift and Simple Transport
          </h1>
          <button
            type="button"
            className="mt-8 px-8 py-3 text-sm font-bold uppercase text-white"
            style={{ background: "#EE3F2C", ...clipTargo }}
          >
            Get Started
          </button>
        </div>
        <div
          className="absolute bottom-8 left-8 max-w-sm rounded-2xl border border-white/10 p-4 text-sm backdrop-blur-[40px] md:left-16"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          <p className="font-semibold">Book a Free Consultation</p>
          <button type="button" className="mt-3 flex items-center gap-2 bg-white px-4 py-2 text-xs font-semibold text-black" style={clipTargo}>
            <Phone className="h-4 w-4" /> Call us
          </button>
        </div>
      </div>
    </div>
  );
}

const MUX_SYNAPSE = "https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8";

export function SynapseHlsHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute bottom-[35vh] left-0 right-0 z-0 h-[80vh]">
        <HlsVideo src={MUX_SYNAPSE} className="h-full w-full object-cover" />
      </div>
      <nav className="relative z-20 flex justify-between border-b border-white/10 bg-black/40 px-8 py-4 backdrop-blur-md">
        <span className="font-medium tracking-tight">Synapse</span>
        <div className="hidden gap-6 text-sm text-white/80 md:flex">
          <span className="border-b border-white">Features</span>
          <span>Insights</span>
          <span>About</span>
          <span className="line-through">Case Studies</span>
          <span>Contact</span>
        </div>
        <button type="button" className="rounded-full bg-gradient-to-r from-white to-gray-400 px-4 py-2 text-xs font-medium text-black">
          Get Started for Free
        </button>
      </nav>
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center gap-2 text-xs">
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Integrated with</span>
          <span className="rounded-full border border-white/20 px-3 py-1">API</span>
        </motion.div>
        <motion.h1
          className="text-5xl font-semibold leading-tight md:text-[80px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Where Innovation Meets Execution
        </motion.h1>
        <p className="mt-6 text-white/70">Ship faster. Test smarter. Deploy with confidence.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button type="button" className="rounded-full border border-white bg-black px-6 py-3 text-sm">
            Get Started for Free
          </button>
          <button type="button" className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm backdrop-blur">
            Let&apos;s Get Connected
          </button>
        </div>
        <div className="mt-20 flex justify-center gap-8 opacity-40 grayscale">
          {["A", "B", "C", "D"].map((x) => (
            <span key={x} className="text-2xl font-bold">
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const MUX_UNLOCK = "https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8";

function BlurIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AiUnlockHlsHeroInner() {
  const words = "Unlock the Power of AI for Your Business.".split(" ");
  return (
    <div className="relative h-screen overflow-hidden bg-[#070612] text-white">
      <div className="absolute inset-y-0 z-0 w-[140%] origin-left scale-[1.2]" style={{ marginLeft: 200 }}>
        <HlsVideo src={MUX_UNLOCK} className="h-full w-full object-cover" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-[#070612] to-transparent" />
      <div className="relative z-20 flex h-full items-center px-6 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-6">
          <BlurIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> New AI Automation Ally
            </span>
          </BlurIn>
          <h1 className="text-4xl font-medium leading-tight md:text-5xl lg:text-6xl lg:leading-[1.2]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="mr-2 inline-block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                {w === "Business." ? (
                  <span className="font-serif italic">{w}</span>
                ) : (
                  w
                )}{" "}
              </motion.span>
            ))}
          </h1>
          <BlurIn delay={0.4}>
            <p className="max-w-xl text-lg leading-relaxed text-white/80">
              Our cutting-edge AI platform automates, analyzes, and accelerates your workflows so you can focus on what really matters.
            </p>
          </BlurIn>
          <BlurIn delay={0.6}>
            <div className="flex flex-wrap gap-4 pt-8">
              <a
                href="/book-call"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#070612]"
              >
                Book A Free Call <ArrowRight className="h-4 w-4" />
              </a>
              <button type="button" className="rounded-full bg-white/20 px-8 py-3 text-sm text-white backdrop-blur-sm">
                Learn now
              </button>
            </div>
          </BlurIn>
        </div>
      </div>
    </div>
  );
}

const MUX_CLEAR = "https://stream.mux.com/hUT6X11m1Vkw1QMxPOLgI761x2cfpi9bHFbi5cNg4014.m3u8";

const ClearBg = memo(function ClearBg() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <HlsVideo src={MUX_CLEAR} className="h-full w-full object-cover" />
    </div>
  );
});

export function ClearInvoiceHeroInner() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="h-1 w-full bg-gradient-to-r from-[#ccf] via-[#e7d04c] to-[#31fb78]" />
      <ClearBg />
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <span className="font-semibold tracking-tight">ClearInvoice</span>
        <div className="hidden gap-8 text-sm md:flex">
          <span>Features</span>
          <span>Pricing</span>
          <span>Reviews</span>
        </div>
        <div className="flex gap-2 text-sm">
          <span>Sign In</span>
          <button type="button" className="rounded-full bg-white px-4 py-2 text-black">
            Sign Up
          </button>
        </div>
      </nav>
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-16 text-center">
        <motion.h1
          className="text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Manage your online store while save 3x operating cost
        </motion.h1>
        <motion.p className="mt-6 text-lg text-white/90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          ClearInvoice takes the hassle out of billing with easy-to-use tools.
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap justify-center gap-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <button
            type="button"
            className="relative rounded-full bg-gradient-to-r from-[#FF3300] to-[#EE7926] px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
          >
            <span className="absolute inset-0 -z-10 rounded-full bg-orange-600 opacity-20 blur-lg" />
            <span className="relative rounded-full border-[1.5px] border-white/20 px-6 py-3">Start free trial</span>
          </button>
          <button
            type="button"
            className="rounded-full border-[1.5px] border-black/5 bg-white/90 px-8 py-4 text-sm font-medium text-black backdrop-blur transition hover:scale-105 hover:bg-white"
          >
            View demo
          </button>
        </motion.div>
        <div className="mt-12 flex items-center justify-center gap-3 text-sm text-white/80">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-white/20" />
            ))}
          </div>
          Trusted by 210k+ stores worldwide
        </div>
      </div>
    </div>
  );
}

type Service = "design" | "development" | "both";
type Timeline = "regular" | "fast" | "rush";

function calculatePrice(service: Service, pages: number, needContent: boolean, needSEO: boolean, timeline: Timeline) {
  const baseMap = { design: { base: 399, perPage: 100 }, development: { base: 199, perPage: 100 }, both: { base: 499, perPage: 200 } };
  const { base, perPage } = baseMap[service];
  let total = Math.max(base, base + (pages - 1) * perPage);
  if (needContent) total += pages * 50;
  if (needSEO) total += pages * 50;
  if (timeline === "rush") total += pages * 100;
  if (timeline === "fast") total += pages * 25;
  return total;
}

function calculateAgencyCost(pages: number, both: boolean) {
  const perPage = both ? 1000 : 400;
  return 8000 + (pages - 1) * perPage;
}

function calculateFreelancerCost(pages: number, both: boolean) {
  const perPage = both ? 500 : 200;
  return 3000 + (pages - 1) * perPage;
}

export function WebfluinCalculatorInner() {
  const [serviceType, setServiceType] = useState<Service>("both");
  const [pages, setPages] = useState(5);
  const [needContent, setNeedContent] = useState(false);
  const [needSEO, setNeedSEO] = useState(false);
  const [timeline, setTimeline] = useState<Timeline>("regular");

  const you = useMemo(
    () => calculatePrice(serviceType, pages, needContent, needSEO, timeline),
    [serviceType, pages, needContent, needSEO, timeline],
  );
  const agency = useMemo(() => calculateAgencyCost(pages, serviceType === "both"), [pages, serviceType]);
  const freelancer = useMemo(() => calculateFreelancerCost(pages, serviceType === "both"), [pages, serviceType]);

  return (
    <section id="calculator-section" className="bg-background py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-16">
        <header className="mb-12 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Try project estimation calculator</p>
          <h2 className="mt-2 text-3xl font-normal md:text-4xl lg:text-5xl">Get premium website within your budget</h2>
        </header>
        <div className="grid overflow-hidden rounded-2xl border border-border lg:grid-cols-2">
          <div className="divide-y divide-[#1E1E1E] bg-[#0D0D0D] p-8 lg:p-12">
            <div className="space-y-4 pb-8">
              <h3 className="font-medium text-white">What kind of service do you need?</h3>
              {(
                [
                  ["Only Design", "design"],
                  ["Only Development", "development"],
                  ["Design + Development", "both"],
                ] as const
              ).map(([label, v]) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 text-sm text-white/90">
                  <input
                    type="radio"
                    name="svc"
                    checked={serviceType === v}
                    onChange={() => setServiceType(v)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      serviceType === v ? "border-[#FF5656]" : "border-white/30",
                    )}
                  >
                    {serviceType === v && <span className="h-2 w-2 rounded-full bg-[#FF5656]" />}
                  </span>
                  {label}
                </label>
              ))}
            </div>
            <div className="space-y-4 py-8">
              <h3 className="text-white">
                Number of Pages <span className="text-[#FF5656]">{pages}</span>
              </h3>
              <input
                type="range"
                min={1}
                max={30}
                value={pages}
                onChange={(e) => setPages(Number(e.target.value))}
                className="w-full accent-[#FF5656]"
              />
              <div className="flex justify-between text-xs text-white/50">
                <span>1</span>
                <span>30</span>
              </div>
            </div>
            <div className="space-y-4 py-8">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/90">
                <input type="checkbox" checked={needContent} onChange={(e) => setNeedContent(e.target.checked)} className="sr-only" />
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                    needContent ? "border-[#FF5656] bg-[#FF5656]" : "border-white/30",
                  )}
                >
                  {needContent && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="flex-1">I will need help with content</span>
                <span className="shrink-0 text-[#FF5656]">+$50/pages</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-white/90">
                <input type="checkbox" checked={needSEO} onChange={(e) => setNeedSEO(e.target.checked)} className="sr-only" />
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                    needSEO ? "border-[#FF5656] bg-[#FF5656]" : "border-white/30",
                  )}
                >
                  {needSEO && <Check className="h-3 w-3 text-white" />}
                </span>
                <span className="flex-1">I want to optimize my website for SEO</span>
                <span className="shrink-0 text-[#FF5656]">+$50/pages</span>
              </label>
            </div>
            <div className="space-y-4 pt-8">
              <h3 className="text-white">How fast do you need this?</h3>
              {(
                [
                  ["Within 7 Days", "rush", "+$100/pages"],
                  ["Within 14 Days", "fast", "+$25/pages"],
                  ["Regular Speed", "regular", "no extra"],
                ] as const
              ).map(([label, v, price]) => (
                <label key={v} className="flex cursor-pointer items-center gap-3 text-sm text-white/90">
                  <input type="radio" name="tl" checked={timeline === v} onChange={() => setTimeline(v)} className="sr-only" />
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2",
                      timeline === v ? "border-[#FF5656]" : "border-white/30",
                    )}
                  >
                    {timeline === v && <span className="h-2 w-2 rounded-full bg-[#FF5656]" />}
                  </span>
                  {label} <span className="text-[#FF5656]">{price}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="min-h-[400px] space-y-6 border-white/10 p-8 lg:min-h-[718px] lg:rounded-r-2xl lg:border lg:border-l-0">
            <h3 className="text-xl font-medium">Estimated Cost</h3>
            <p className="text-sm text-muted-foreground">Compare typical market rates with Webfluin Studio.</p>
            <div className="space-y-4 rounded-2xl bg-muted/50 p-6">
              <p className="text-sm font-medium">Typical Agency charges minimum</p>
              <p className="text-4xl font-bold">${agency.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">+ Too much extra time & additional cost</p>
            </div>
            <div className="space-y-4 rounded-2xl bg-muted/50 p-6">
              <p className="text-sm font-medium">Regular Freelancer charges minimum</p>
              <p className="text-4xl font-bold">${freelancer.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">+ Too much headache & back-and-forth</p>
            </div>
            <div className="space-y-4 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
              <p className="text-sm font-medium">With Webfluin Studio</p>
              <p className="text-5xl font-bold">${you.toLocaleString()}</p>
              <p className="text-sm opacity-90">Save your money, time & headache</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Export scaled previews for library */
export function MarketingPreviewStellar() {
  return wrap(0.2, <StellarAiHeroInner />);
}
export function MarketingPreviewPowerAi() {
  return wrap(0.14, <PowerAiHeroInner />, "bg-black");
}
export function MarketingPreviewAethera() {
  return wrap(0.18, <AetheraHeroInner />);
}
export function MarketingPreviewRubik() {
  return wrap(0.22, <RubikEraHeroInner />);
}
export function MarketingPreviewWeb3() {
  return wrap(0.2, <Web3EosHeroInner />);
}
export function MarketingPreviewGlassHls() {
  return wrap(0.16, <GlassHlsHeroInner />, "bg-[#010101]");
}
export function MarketingPreviewGeist() {
  return wrap(0.2, <GeistMinimalHeroInner />);
}
export function MarketingPreviewAiBuilder() {
  return wrap(0.18, <AiBuilderHlsHeroInner />, "bg-black");
}
export function MarketingPreviewTaskly() {
  return wrap(0.2, <TasklyGlassHeroInner />);
}
export function MarketingPreviewBarlow() {
  return wrap(0.2, <BarlowAgencyHeroInner />);
}
export function MarketingPreviewBloom() {
  return wrap(0.15, <BloomGlassHeroInner />, "bg-black");
}
export function MarketingPreviewTargo() {
  return wrap(0.22, <TargoHeroInner />);
}
export function MarketingPreviewSynapse() {
  return wrap(0.14, <SynapseHlsHeroInner />, "bg-black");
}
export function MarketingPreviewAiUnlock() {
  return wrap(0.12, <AiUnlockHlsHeroInner />, "bg-[#070612]");
}
export function MarketingPreviewClearInvoice() {
  return wrap(0.15, <ClearInvoiceHeroInner />, "bg-black");
}
export function MarketingPreviewCalculator() {
  return wrap(0.35, <WebfluinCalculatorInner />);
}
