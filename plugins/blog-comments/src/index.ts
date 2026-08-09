import { Comments, type CommentsOptions } from "@quartz-community/comments"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"

const pointsToBlog = (value: unknown): boolean => {
  const values = Array.isArray(value) ? value : [value]
  return values.some((candidate) => {
    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>
      candidate = record.path ?? record.link ?? record.value
    }
    if (typeof candidate !== "string") return false
    let parent = candidate.trim()
    if (parent.startsWith("[[") && parent.endsWith("]]")) {
      parent = parent.slice(2, -2)
    }
    parent = parent.split("|")[0].split("#")[0].trim()
    return parent.toLocaleLowerCase() === "blog"
  })
}

export const BlogComments = ((opts?: CommentsOptions) => {
  if (!opts) throw new Error("BlogComments requires giscus options")
  const comments = Comments(opts)
  const component = ((props: QuartzComponentProps) => {
    if (!pointsToBlog(props.fileData.frontmatter?.up)) return null
    return comments(props)
  }) as QuartzComponent

  component.css = comments.css
  component.beforeDOMLoaded = comments.beforeDOMLoaded
  component.afterDOMLoaded = comments.afterDOMLoaded
  return component
}) satisfies QuartzComponentConstructor<CommentsOptions>

export type { CommentsOptions as BlogCommentsOptions }
