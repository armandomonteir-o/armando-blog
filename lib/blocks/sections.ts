import { plainText, slugify } from "./text";
import type { EditorBlock, PostSection } from "./types";

function isSectionHeading(block: EditorBlock): boolean {
  return block.name === "core/heading" && block.attributes?.level === 2;
}

// Splits the post body at each level-2 heading. What comes before the first one goes in an
// untitled "intro" section. Every id is unique, so the index and the anchors never collide.
export function sectionsFromBlocks(blocks: EditorBlock[]): PostSection[] {
  const sections: PostSection[] = [];
  const used = new Set<string>();

  function uniqueId(base: string): string {
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  }

  for (const block of blocks) {
    if (isSectionHeading(block)) {
      const title = plainText(String(block.attributes?.content ?? ""));
      const anchor = block.attributes?.anchor;
      const base =
        (typeof anchor === "string" && anchor) || slugify(title) || `secao-${sections.length + 1}`;
      sections.push({ id: uniqueId(base), title, blocks: [] });
    } else {
      if (sections.length === 0) sections.push({ id: uniqueId("intro"), title: "", blocks: [] });
      sections[sections.length - 1].blocks.push(block);
    }
  }
  return sections;
}
