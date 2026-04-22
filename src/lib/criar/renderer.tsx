import { type CriarCanvasElement, type CriarPageSchema, type CriarProjectSchema } from "@/lib/criar/schema";

export function getHomePage(schema: CriarProjectSchema): CriarPageSchema {
  return schema.pages[0]!;
}

export function sortByLayer(elements: CriarCanvasElement[]): CriarCanvasElement[] {
  return [...elements].sort((a, b) => a.y - b.y);
}
