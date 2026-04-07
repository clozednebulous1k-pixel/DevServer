"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ElementType = React.ElementType;

interface VerticalTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export const VerticalText = ({
  as: Comp = "div",
  className,
  style,
  ...props
}: VerticalTextProps) => {
  return (
    <Comp
      className={cn("size-min -rotate-180 whitespace-nowrap", className)}
      style={{
        writingMode: "vertical-rl",
        ...style,
      }}
      {...props}
    />
  );
};
