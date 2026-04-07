import type { ComponentProps } from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

export type LogoCloud4Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type LogoCloud4Props = ComponentProps<"div"> & {
  logos: LogoCloud4Logo[];
};

export function LogoCloud4({ className, logos, ...props }: LogoCloud4Props) {
  return (
    <div
      {...props}
      className={cn(
        "relative mx-auto max-w-3xl bg-gradient-to-r from-secondary via-transparent to-secondary py-6 md:border-x",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2 border-t" />

      <InfiniteSlider gap={42} reverse speed={60} speedOnHover={20}>
        {logos.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={logo.alt}
            className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
            height="auto"
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width="auto"
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute left-0 top-0 h-full w-[160px]"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute right-0 top-0 h-full w-[160px]"
        direction="right"
      />

      <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2 border-b" />
    </div>
  );
}
