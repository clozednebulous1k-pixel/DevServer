from pathlib import Path

p = Path("src/components/prompts/prompt-library.tsx")
lines = p.read_text(encoding="utf-8").splitlines(keepends=True)


def chunk(a: int, b: int) -> str:
    return "".join(lines[a - 1 : b])

tail = r"""
export const ALL_LIBRARY_CATEGORIES = [
  "heroes", "backgrounds", "borders", "carousels", "images", "navigation", "texts", "scroll",
] as const;
export type AllLibraryCategoryId = (typeof ALL_LIBRARY_CATEGORIES)[number];
export type LibraryEntryWithPrompt =
  | (typeof heroPrompts)[number]
  | (typeof backgroundPrompts)[number]
  | (typeof borderPrompts)[number]
  | (typeof clientCarouselPrompts)[number]
  | (typeof imagePrompts)[number]
  | (typeof navigationPrompts)[number]
  | (typeof textPrompts)[number]
  | (typeof scrollPrompts)[number];
"""

out = Path("src/lib/biblioteca/library-prompt-entries.ts")
parts: list[str] = [
    "// Shared prompt catalog: single source of truth for /biblioteca and CRIAR.\n",
    "// Extraction: scripts/extract-prompt-entries.py\n",
    "\n",
    chunk(101, 497),  # hero
    "\n",
    chunk(498, 707),  # bg
    "\n",
    chunk(710, 944),  # borders
    "\n",
    chunk(965, 1152),  # carousels
    "\n",
    chunk(1154, 1391),  # images
    "\n",
    chunk(1393, 1528),  # nav
    "\n",
    chunk(1530, 1681),  # text
    "\n",
    chunk(1684, 1996),  # scroll
    tail,
]
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("".join(parts), encoding="utf-8")
print("Wrote", out, "chars", out.stat().st_size)
