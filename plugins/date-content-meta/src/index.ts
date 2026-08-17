import { ContentMeta } from "@quartz-community/content-meta"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { Fragment, h, type ComponentChildren, type VNode } from "preact"

export interface DateContentMetaOptions {
  showReadingTime: boolean
  showComma: boolean
}

type DateValues = {
  created?: Date | string
  modified?: Date | string
}

type FrontmatterValues = {
  up?: unknown
  description?: unknown
  Description?: unknown
}

const asDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const pointsToBlog = (value: unknown): boolean => {
  const values = Array.isArray(value) ? value : [value]
  return values.some((candidate) => {
    if (typeof candidate !== "string") return false
    let parent = candidate.trim()
    if (parent.startsWith("[[") && parent.endsWith("]]")) {
      parent = parent.slice(2, -2)
    }
    parent = parent.split("|")[0].split("#")[0].trim()
    return parent.toLocaleLowerCase() === "blog"
  })
}

export const DateContentMeta = ((opts?: Partial<DateContentMetaOptions>) => {
  const options = {
    showReadingTime: true,
    showComma: true,
    ...opts,
  }
  const base = ContentMeta(options)

  const component = ((props: QuartzComponentProps) => {
    const rendered = base(props) as VNode<{
      children?: ComponentChildren
      class?: string
    }> | null
    const frontmatter = props.fileData.frontmatter as FrontmatterValues | undefined
    const isBlogpost = pointsToBlog(frontmatter?.up)
    const rawDescription = frontmatter?.description ?? frontmatter?.Description
    const description = typeof rawDescription === "string" ? rawDescription.trim() : ""
    const subtitle =
      isBlogpost && description ? h("p", { class: "article-subtitle" }, description) : null

    if (!rendered) return subtitle
    const metadataProps = isBlogpost
      ? {
          ...rendered.props,
          class: [rendered.props.class, "blog-post-meta"].filter(Boolean).join(" "),
        }
      : rendered.props

    const dates = props.fileData.dates as DateValues | undefined
    const created = asDate(dates?.created)
    if (!created) {
      const metadata = h("p", metadataProps, rendered.props.children)
      return subtitle ? h(Fragment, null, subtitle, metadata) : metadata
    }

    const locale = props.cfg.locale ?? "en-US"
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })
    const createdText = formatter.format(created)
    const modified = asDate(dates?.modified)
    const modifiedText = modified ? formatter.format(modified) : undefined
    const dateText =
      modifiedText && modifiedText !== createdText
        ? `Created: ${createdText} (Modified: ${modifiedText})`
        : `Created: ${createdText}`

    const originalChildren = Array.isArray(rendered.props.children)
      ? rendered.props.children
      : [rendered.props.children]
    const children: ComponentChildren[] = [h("span", null, dateText)]
    if (options.showReadingTime && isBlogpost) {
      const readingTime = originalChildren.at(-1)
      if (readingTime != null) children.push(readingTime)
    }

    const metadata = h("p", metadataProps, children)
    return subtitle ? h(Fragment, null, subtitle, metadata) : metadata
  }) as QuartzComponent

  component.css = `${base.css ?? ""}
.article-subtitle {
  margin: 0.55rem 0 0.8rem;
  color: var(--gray);
  font-size: 1.15rem;
  line-height: 1.5;
  font-weight: 400;
}`
  return component
}) satisfies QuartzComponentConstructor<DateContentMetaOptions>
