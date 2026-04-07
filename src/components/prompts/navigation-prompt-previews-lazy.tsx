"use client";

import { PreviewHeader1, PreviewHeader3, PreviewNavbar1 } from "@/components/prompts/navigation-prompt-previews";

export function NavigationPreviewLazyRouter({ id }: { id: string }) {
  switch (id) {
    case "navbar-1":
      return <PreviewNavbar1 />;
    case "header-1":
      return <PreviewHeader1 />;
    case "header-3":
      return <PreviewHeader3 />;
    default:
      return null;
  }
}
