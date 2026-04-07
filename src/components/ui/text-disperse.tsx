'use client';

import { useState } from 'react';
import type { ComponentProps, JSX } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Transform {
  x: number;
  y: number;
  rotationZ: number;
}

const transforms: Transform[] = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
];

type TextDisperseProps = ComponentProps<'div'> & {
  children: string;
  onHover?: (isActive: boolean) => void;
};

export function TextDisperse({
  children,
  onHover,
  className,
  ...props
}: Omit<TextDisperseProps, 'onMouseEnter' | 'onMouseLeave'>) {
  const [isAnimated, setIsAnimated] = useState(false);

  const splitWord = (word: string) => {
    const chars: JSX.Element[] = [];
    word.split('').forEach((char, i) => {
      if (char === ' ') {
        chars.push(
          <span
            key={`space-${i}`}
            className="inline-block w-[0.35em]"
            aria-hidden="true"
          >
            &nbsp;
          </span>,
        );
        return;
      }

      const t = transforms[i] ?? transforms[i % transforms.length];
      chars.push(
        <motion.span
          custom={i}
          variants={{
            open: () => ({
              x: `${t.x}em`,
              y: `${t.y}em`,
              rotateZ: t.rotationZ,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 1,
            }),
            closed: {
              x: 0,
              y: 0,
              rotateZ: 0,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 0,
            },
          }}
          animate={isAnimated ? 'open' : 'closed'}
          key={`${char}-${i}`}
        >
          {char}
        </motion.span>,
      );
    });
    return chars;
  };

  return (
    <div
      className={cn(
        "relative inline-flex cursor-pointer",
        className,
      )}
      onMouseEnter={() => {
        onHover?.(true);
        setIsAnimated(true);
      }}
      onMouseLeave={() => {
        onHover?.(false);
        setIsAnimated(false);
      }}
      {...props}
    >
      {splitWord(children)}
    </div>
  );
}
