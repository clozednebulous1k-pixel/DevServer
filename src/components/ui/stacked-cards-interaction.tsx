"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

function Card({
  className,
  image,
  children,
}: {
  className?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "h-[400px] w-[350px] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-[0_0_10px_rgba(0,0,0,0.02)]",
        className,
      )}
    >
      {image && (
        <div className="relative mx-2 mt-2 h-72 w-[calc(100%-1rem)] overflow-hidden rounded-xl shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="mt-0 h-full w-full object-cover" />
        </div>
      )}
      {children && <div className="flex flex-col gap-y-2 px-4 py-2 text-card-foreground">{children}</div>}
    </div>
  );
}

export interface StackedCardData {
  image: string;
  title: string;
  description: string;
}

export function StackedCardsInteraction({
  cards,
  spreadDistance = 40,
  rotationAngle = 5,
  animationDelay = 0.1,
}: {
  cards: StackedCardData[];
  spreadDistance?: number;
  rotationAngle?: number;
  animationDelay?: number;
}) {
  const [isHovering, setIsHovering] = useState(false);

  const limitedCards = cards.slice(0, 3);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-[400px] w-[350px]">
        {limitedCards.map((card, index) => {
          const isFirst = index === 0;

          let xOffset = 0;
          let rotation = 0;

          if (limitedCards.length > 1) {
            if (index === 1) {
              xOffset = -spreadDistance;
              rotation = -rotationAngle;
            } else if (index === 2) {
              xOffset = spreadDistance;
              rotation = rotationAngle;
            }
          }

          return (
            <motion.div
              key={card.title}
              className={cn("absolute", isFirst ? "z-10" : "z-0")}
              initial={{ x: 0, rotate: 0 }}
              animate={{
                x: isHovering ? xOffset : 0,
                rotate: isHovering ? rotation : 0,
                zIndex: isFirst ? 10 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
                delay: index * animationDelay,
                type: "spring",
              }}
              {...(isFirst && {
                onHoverStart: () => setIsHovering(true),
                onHoverEnd: () => setIsHovering(false),
              })}
            >
              <Card className={isFirst ? "z-10 cursor-pointer" : "z-0"} image={card.image}>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { Card };
