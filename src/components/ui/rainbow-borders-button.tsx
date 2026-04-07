"use client";

import type { ButtonHTMLAttributes } from "react";

const RAINBOW_STYLE = `
@keyframes rainbow-border-move {
  0% { background-position: 0 0; }
  50% { background-position: 400% 0; }
  100% { background-position: 0 0; }
}
.rainbow-border-btn-wrap { position: relative; display: inline-flex; }
.rainbow-border-btn-wrap::before,
.rainbow-border-btn-wrap::after {
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  border-radius: 12px;
  background: linear-gradient(45deg, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000);
  background-size: 400%;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  z-index: -1;
  animation: rainbow-border-move 20s linear infinite;
}
.rainbow-border-btn-wrap::after { filter: blur(50px); }
`;

export interface RainbowBordersButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function RainbowBordersButton({ label = "Button", className = "", children, ...props }: RainbowBordersButtonProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RAINBOW_STYLE }} />
      <div className="rainbow-border-btn-wrap">
        <button
          type="button"
          className={`relative flex h-10 cursor-pointer items-center justify-center gap-2.5 rounded-xl border-none bg-black px-4 font-black text-white transition-all duration-200 ${className}`}
          {...props}
        >
          {children ?? label}
        </button>
      </div>
    </>
  );
}
