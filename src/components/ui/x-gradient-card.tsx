"use client";

import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReplyProps {
  authorName: string;
  authorHandle: string;
  authorImage: string;
  content: string;
  isVerified?: boolean;
  timestamp: string;
}

export interface XCardProps {
  link?: string;
  authorName?: string;
  authorHandle?: string;
  authorImage?: string;
  content?: string[];
  isVerified?: boolean;
  timestamp?: string;
  reply?: ReplyProps;
}

export function XCard({
  link = "https://x.com",
  authorName = "Dorian",
  authorHandle = "dorian_baffier",
  authorImage = "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
  content = ["Linha um do post.", "Linha dois."],
  isVerified = true,
  timestamp = "Jan 18, 2025",
  reply,
}: XCardProps) {
  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <div
        className={cn(
          "relative isolate w-full min-w-[280px] max-w-xl overflow-hidden rounded-2xl p-1.5 md:min-w-[500px]",
          "bg-white/5 dark:bg-black/90",
          "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
          "backdrop-blur-xl backdrop-saturate-[180%]",
          "border border-black/10 dark:border-white/10",
          "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
          "will-change-transform translate-z-0",
        )}
      >
        <div
          className={cn(
            "relative w-full rounded-xl p-5",
            "bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
            "backdrop-blur-md backdrop-saturate-150",
            "border border-black/[0.05] dark:border-white/[0.08]",
            "text-black/90 dark:text-white",
            "shadow-sm",
            "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/[0.02] before:to-black/[0.01] before:opacity-0 before:transition-opacity dark:before:from-white/[0.03] dark:before:to-white/[0.01]",
            "hover:before:opacity-100",
          )}
        >
          <div className="flex gap-3">
            <div className="shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={authorImage} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-black hover:underline dark:text-white/90">{authorName}</span>
                    {isVerified ? <BadgeCheck className="h-4 w-4 shrink-0 text-blue-400" aria-hidden /> : null}
                  </div>
                  <span className="text-sm text-black/70 dark:text-white/60">@{authorHandle}</span>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <title>X</title>
                    <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            {content.map((item, index) => (
              <p key={index} className="text-base text-black/90 dark:text-white/90">
                {item}
              </p>
            ))}
            <span className="mt-2 block text-sm text-black/50 dark:text-white/50">{timestamp}</span>
          </div>
          {reply ? (
            <div className="mt-4 border-t border-black/[0.08] pt-4 dark:border-white/[0.08]">
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reply.authorImage} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1 text-sm">
                    <span className="font-semibold text-black dark:text-white/90">{reply.authorName}</span>
                    {reply.isVerified ? <BadgeCheck className="h-4 w-4 text-blue-400" aria-hidden /> : null}
                    <span className="text-black/60 dark:text-white/60">@{reply.authorHandle}</span>
                    <span className="text-black/60 dark:text-white/60">·</span>
                    <span className="text-black/60 dark:text-white/60">{reply.timestamp}</span>
                  </div>
                  <p className="mt-1 text-sm text-black/80 dark:text-white/80">{reply.content}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
