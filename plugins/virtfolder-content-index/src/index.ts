import fs from "node:fs/promises"
import path from "node:path"
import { ContentIndex } from "@quartz-community/content-index"
import type {
  BuildCtx,
  FilePath,
  ProcessedContent,
  QuartzEmitterPlugin,
} from "@quartz-community/types"

type ContentIndexOptions = Parameters<typeof ContentIndex>[0]

async function addVirtFolderParents(
  ctx: BuildCtx,
  content: ProcessedContent[],
): Promise<void> {
  const indexPath = path.join(ctx.argv.output, "static", "contentIndex.json")
  const index = JSON.parse(await fs.readFile(indexPath, "utf8")) as Record<
    string,
    Record<string, unknown>
  >

  for (const [, file] of content) {
    const data = file.data as Record<string, unknown>
    if (data.unlisted === true) continue

    const slug = data.slug
    const frontmatter = data.frontmatter as Record<string, unknown> | undefined
    const up = frontmatter?.up
    if (typeof slug === "string" && up !== undefined && index[slug]) {
      index[slug].up = up
    }
  }

  await fs.writeFile(indexPath, JSON.stringify(index))
}

export const VirtFolderContentIndex: QuartzEmitterPlugin<ContentIndexOptions> = (options) => {
  const contentIndex = ContentIndex(options)

  const emit = async (
    ctx: BuildCtx,
    content: ProcessedContent[],
    run: () => Promise<FilePath[]>,
  ): Promise<FilePath[]> => {
    const outputs = await run()
    await addVirtFolderParents(ctx, content)
    return outputs
  }

  return {
    ...contentIndex,
    name: "VirtFolderContentIndex",
    emit: (ctx, content) => emit(ctx, content, () => contentIndex.emit(ctx, content)),
    partialEmit: contentIndex.partialEmit
      ? (ctx, content) => emit(ctx, content, () => contentIndex.partialEmit!(ctx, content))
      : undefined,
  }
}
