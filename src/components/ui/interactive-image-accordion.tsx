"use client";

import React, { useState } from "react";

export type AccordionImageItem = {
  id: number;
  title: string;
  imageUrl: string;
};

const defaultAccordionItems: AccordionImageItem[] = [
  {
    id: 1,
    title: "Voice Assistant",
    imageUrl: "https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "AI Image Generation",
    imageUrl: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "AI Chatbot + Local RAG",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "AI Agent",
    imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2090&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Visual Understanding",
    imageUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2070&auto=format&fit=crop",
  },
];

function AccordionItem({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionImageItem;
  isActive: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <div
      className={`relative h-[450px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-in-out ${
        isActive ? "w-[400px]" : "w-[60px]"
      }`}
      onMouseEnter={onMouseEnter}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          const t = e.target as HTMLImageElement;
          t.onerror = null;
          t.src = "https://placehold.co/400x450/2d3748/ffffff?text=Image+Error";
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <span
        className={`absolute whitespace-nowrap text-lg font-semibold text-white transition-all duration-300 ease-in-out ${
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
            : "bottom-24 left-1/2 w-auto -translate-x-1/2 rotate-90 text-left"
        }`}
      >
        {item.title}
      </span>
    </div>
  );
}

export interface LandingAccordionItemProps {
  items?: AccordionImageItem[];
}

export function LandingAccordionItem({ items = defaultAccordionItems }: LandingAccordionItemProps) {
  const [activeIndex, setActiveIndex] = useState(4);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-background font-sans">
      <section className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="w-full text-center md:w-1/2 md:text-left">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-6xl">
              Accelerate Gen-AI Tasks on Any Device
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground mx-auto md:mx-0">
              Build high-performance AI apps on-device without the hassle of model compression or edge deployment.
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block rounded-lg bg-foreground px-8 py-3 font-semibold text-background shadow-lg transition-colors duration-300 hover:bg-foreground/90"
              >
                Contact Us
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
              {items.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
