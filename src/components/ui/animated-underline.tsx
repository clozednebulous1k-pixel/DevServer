"use client";

export function AnimatedUnderline() {
  return (
    <div className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100">
      <span className="text-primary">Hover me</span>
    </div>
  );
}
