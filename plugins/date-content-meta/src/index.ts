import { ContentMeta } from "@quartz-community/content-meta"
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types"
import { h, type ComponentChildren, type VNode } from "preact"

export interface DateContentMetaOptions {
  showReadingTime: boolean
  showComma: boolean
}

type DateValues = {
  created?: Date | string
  modified?: Date | string
}

type FrontmatterValues = {
  tags?: string[]
}

const asDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export const DateContentMeta = ((opts?: Partial<DateContentMetaOptions>) => {
  const options = {
    showReadingTime: true,
    showComma: true,
    ...opts,
  }
  const base = ContentMeta(options)

  const component = ((props: QuartzComponentProps) => {
    const rendered = base(props) as VNode<{ children?: ComponentChildren }> | null
    if (!rendered) return null

    const dates = props.fileData.dates as DateValues | undefined
    const created = asDate(dates?.created)
    if (!created) return rendered

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
    const frontmatter = props.fileData.frontmatter as FrontmatterValues | undefined
    const isBlogpost = frontmatter?.tags?.some(
      (tag) => tag.replace(/^#/, "").toLocaleLowerCase() === "blogpost",
    )
    if (options.showReadingTime && isBlogpost) {
      const readingTime = originalChildren.at(-1)
      if (readingTime != null) children.push(readingTime)
    }

    return h("p", rendered.props, children)
  }) as QuartzComponent

  component.css = base.css
  return component
}) satisfies QuartzComponentConstructor<DateContentMetaOptions>
