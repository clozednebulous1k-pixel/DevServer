"use client";

import type { FC } from "react";
import Image from "next/image";

export interface ScrollCardItem {
  title: string;
  description: string;
  tag: string;
  src: string;
  link: string;
  color: string;
  textColor: string;
}

interface ScrollCardProps extends Omit<ScrollCardItem, "src" | "link" | "tag"> {
  i: number;
  src: string;
}

const Card: FC<ScrollCardProps> = ({ title, description, color, textColor, src }) => {
  return (
    <div className="sticky top-0 flex h-screen items-center justify-center px-4 md:p-0">
      <div
        className="relative mx-auto flex h-[300px] w-[700px] flex-col items-center justify-center overflow-hidden rounded-none py-12 pl-3 pr-3 pt-3 pb-4 shadow-md md:h-[400px] md:w-[600px] md:px-12"
        style={{ backgroundColor: color }}
      >
        <span className="relative z-10 mt-5 text-5xl font-bold md:text-7xl">
          <span className="relative font-black tracking-tight" style={{ color: textColor }}>
            {title}
          </span>
        </span>
        <div
          className="relative z-10 mt-2 mb-0 text-center text-lg font-medium lowercase tracking-wide md:text-2xl"
          style={{ lineHeight: 1.4, color: textColor }}
        >
          {description}
        </div>
        <div className="absolute inset-0 z-0">
          <Image className="object-cover" src={src} alt="" fill sizes="(max-width: 768px) 100vw, 600px" />
        </div>
      </div>
    </div>
  );
};

export interface CardsParallaxProps {
  items: ScrollCardItem[];
}

export const CardsParallax: FC<CardsParallaxProps> = ({ items }) => {
  return (
    <div className="min-h-screen">
      {items.map((project, i) => (
        <Card key={`p_${i}`} {...project} i={i} />
      ))}
    </div>
  );
};
