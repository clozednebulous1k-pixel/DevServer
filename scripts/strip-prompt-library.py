from pathlib import Path

p = Path("src/components/prompts/prompt-library.tsx")
lines = p.read_text(encoding="utf-8").splitlines(keepends=True)
# Remove 1-based lines 101-1996 (duplicate prompt data now in library-prompt-entries)
new_lines = lines[:100] + lines[1996:]
import_line = 'import {\n  heroPrompts,\n  backgroundPrompts,\n  borderPrompts,\n  clientCarouselPrompts,\n  imagePrompts,\n  navigationPrompts,\n  textPrompts,\n  scrollPrompts,\n} from "@/lib/biblioteca/library-prompt-entries";\n'
# Insert after line 26 (index 26) - after last import in block - actually after SeoGuiaPratico import
out = []
for i, line in enumerate(new_lines):
    out.append(line)
    if line.strip() == 'import { SeoGuiaPratico } from "@/components/biblioteca/seo-guia-pratico";':
        out.append("\n")
        out.append(import_line)
p.write_text("".join(out), encoding="utf-8")
print("Updated prompt-library.tsx, new line count", len("".join(out).splitlines()))
