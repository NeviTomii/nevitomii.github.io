import fs from "node:fs/promises";
import path from "node:path";
import { ContentIndex } from "@quartz-community/content-index";

async function addVirtFolderParents(ctx, content) {
  const indexPath = path.join(ctx.argv.output, "static", "contentIndex.json");
  const index = JSON.parse(await fs.readFile(indexPath, "utf8"));
  for (const [, file] of content) {
    const data = file.data;
    if (data.unlisted === true) continue;
    const slug = data.slug;
    const up = data.frontmatter?.up;
    if (typeof slug === "string" && up !== void 0 && index[slug]) {
      index[slug].up = up;
    }
  }
  await fs.writeFile(indexPath, JSON.stringify(index));
}

const VirtFolderContentIndex = (options) => {
  const contentIndex = ContentIndex(options);
  const emit = async (ctx, content, run) => {
    const outputs = await run();
    await addVirtFolderParents(ctx, content);
    return outputs;
  };
  return {
    ...contentIndex,
    name: "VirtFolderContentIndex",
    emit: (ctx, content) => emit(ctx, content, () => contentIndex.emit(ctx, content)),
    partialEmit: contentIndex.partialEmit ? (ctx, content) => emit(ctx, content, () => contentIndex.partialEmit(ctx, content)) : void 0
  };
};

export { VirtFolderContentIndex };
