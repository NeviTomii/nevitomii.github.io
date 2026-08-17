import { ContentMeta } from "@quartz-community/content-meta";
import { Fragment, h } from "preact";

const asDate = (value) => {
  if (!value) return void 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? void 0 : date;
};

const pointsToBlog = (value) => {
  const values = Array.isArray(value) ? value : [value];
  return values.some((candidate) => {
    if (typeof candidate !== "string") return false;
    let parent = candidate.trim();
    if (parent.startsWith("[[") && parent.endsWith("]]")) parent = parent.slice(2, -2);
    parent = parent.split("|")[0].split("#")[0].trim();
    return parent.toLocaleLowerCase() === "blog";
  });
};

const DateContentMeta = (opts) => {
  const options = {
    showReadingTime: true,
    showComma: true,
    ...opts
  };
  const base = ContentMeta(options);
  const component = (props) => {
    const rendered = base(props);
    const frontmatter = props.fileData.frontmatter;
    const isBlogpost = pointsToBlog(frontmatter?.up);
    const rawDescription = frontmatter?.description ?? frontmatter?.Description;
    const description = typeof rawDescription === "string" ? rawDescription.trim() : "";
    const subtitle = isBlogpost && description ? h("p", { class: "article-subtitle" }, description) : null;
    if (!rendered) return subtitle;
    const metadataProps = isBlogpost ? {
      ...rendered.props,
      class: [rendered.props.class, "blog-post-meta"].filter(Boolean).join(" ")
    } : rendered.props;
    const dates = props.fileData.dates;
    const created = asDate(dates?.created);
    if (!created) {
      const metadata = h("p", metadataProps, rendered.props.children);
      return subtitle ? h(Fragment, null, subtitle, metadata) : metadata;
    }
    const locale = props.cfg.locale ?? "en-US";
    const formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
    const createdText = formatter.format(created);
    const modified = asDate(dates?.modified);
    const modifiedText = modified ? formatter.format(modified) : void 0;
    const dateText = modifiedText && modifiedText !== createdText ? `Created: ${createdText} (Modified: ${modifiedText})` : `Created: ${createdText}`;
    const originalChildren = Array.isArray(rendered.props.children) ? rendered.props.children : [rendered.props.children];
    const children = [h("span", null, dateText)];
    if (options.showReadingTime && isBlogpost) {
      const readingTime = originalChildren.at(-1);
      if (readingTime != null) children.push(readingTime);
    }
    const metadata = h("p", metadataProps, children);
    return subtitle ? h(Fragment, null, subtitle, metadata) : metadata;
  };
  component.css = `${base.css ?? ""}
.article-subtitle {
  margin: 0.55rem 0 0.8rem;
  color: var(--gray);
  font-size: 1.15rem;
  line-height: 1.5;
  font-weight: 400;
}`;
  return component;
};

export { DateContentMeta };
