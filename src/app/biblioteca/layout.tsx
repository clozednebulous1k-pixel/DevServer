import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Biblioteca de prompts | DevServer",
  description: "Prompts de front-end e prévias visuais - DevServer.",
};

export default function BibliotecaLayout({ children }: { children: ReactNode }) {
  return children;
}
