"use client";

import { Header as Header1 } from "@/components/ui/header-1";
import { Header as Header3 } from "@/components/ui/header-3";
import { Navbar1 } from "@/components/ui/shadcnblocks-com-navbar1";

export function PreviewNavbar1() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(920px,230vw)] max-w-none -translate-x-1/2 scale-[0.38] origin-top">
        <Navbar1 />
      </div>
    </div>
  );
}

export function PreviewHeader1() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(920px,230vw)] max-w-none -translate-x-1/2 scale-[0.38] origin-top">
        <Header1 />
      </div>
    </div>
  );
}

export function PreviewHeader3() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(920px,230vw)] max-w-none -translate-x-1/2 scale-[0.38] origin-top">
        <Header3 />
      </div>
    </div>
  );
}
