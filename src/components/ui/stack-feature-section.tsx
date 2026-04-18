"use client";

import type { ComponentType, CSSProperties } from "react";
import Link from "next/link";
import {
  FaApple,
  FaAws,
  FaDocker,
  FaGithub,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaNodeJs,
  FaReact,
  FaTwitter,
} from "react-icons/fa";
import { SiFacebook, SiNextdotjs, SiRedux, SiTypescript, SiVercel } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fallbackUrls = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  "https://upload.wikimedia.org/wikipedia/commons/9/96/Among_Us_icon.png",
];

const iconConfigs: Array<{
  Icon: ComponentType<{ className?: string; style?: CSSProperties }> | null;
  color?: string;
  img?: string;
}> = [
  { Icon: FaReact, color: "#61DAFB" },
  { Icon: FaAws, color: "#FF9900" },
  { Icon: FaDocker, color: "#2496ED" },
  { Icon: FaNodeJs, color: "#339933" },
  { Icon: SiNextdotjs, color: "var(--foreground)" },
  { Icon: SiVercel, color: "var(--foreground)" },
  { Icon: SiRedux, color: "#764ABC" },
  { Icon: SiTypescript, color: "#3178C6" },
  { Icon: FaGithub, color: "#181717" },
  { Icon: FaTwitter, color: "#1DA1F2" },
  { Icon: FaLinkedin, color: "#0077B5" },
  { Icon: FaInstagram, color: "#E1306C" },
  { Icon: FaGoogle, color: "#DB4437" },
  { Icon: FaApple, color: "var(--foreground)" },
  { Icon: SiFacebook, color: "#1877F2" },
  { Icon: null, img: fallbackUrls[0] },
  { Icon: null, img: fallbackUrls[1] },
];

export default function StackFeatureSection() {
  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className="relative mx-auto my-16 flex min-h-[24rem] max-w-6xl flex-col items-stretch justify-center overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 md:h-[30rem] md:flex-row md:items-center md:justify-between md:pl-10 md:pr-0">
      <div className="z-10 w-full pr-0 md:max-w-[50%] md:pr-6">
        <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-5xl md:text-6xl">
          Da ideia ao ar
        </h2>
        <p className="mb-6 max-w-lg text-muted-foreground">
          Stack moderna com React, Next.js e infraestrutura cloud - o mesmo tipo de base que usamos para sites e sistemas
          que precisam escalar.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/orcamento"
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full")}
          >
            Solicitar orçamento
          </Link>
          <Link
            href="/projetos"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}
          >
            Ver projetos
          </Link>
        </div>
      </div>

      <div className="relative mt-8 hidden h-64 w-full shrink-0 items-center justify-center overflow-hidden md:mt-0 md:flex md:h-full md:w-1/2 md:justify-start">
        <div className="relative flex h-[50rem] w-[50rem] translate-x-[50%] items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted shadow-lg">
            <FaReact className="h-12 w-12 text-[#61DAFB]" aria-hidden />
          </div>

          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${12 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border-2 border-dotted border-border"
                style={{
                  width: size,
                  height: size,
                  animation: `orbit-rotate ${12 + orbitIdx * 6}s linear infinite`,
                }}
              >
                {iconConfigs
                  .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        className="absolute rounded-full bg-card p-1 shadow-md"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {cfg.Icon ? (
                          <cfg.Icon className="h-8 w-8" style={{ color: cfg.color }} />
                        ) : cfg.img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cfg.img} alt="" className="h-8 w-8 object-contain" />
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
