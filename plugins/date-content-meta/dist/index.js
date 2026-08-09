import { ContentMeta } from "@quartz-community/content-meta";
import { h } from "preact";

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
    if (!rendered) return null;
    const dates = props.fileData.dates;
    const created = asDate(dates?.created);
    if (!created) return rendered;
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
    const frontmatter = props.fileData.frontmatter;
    const isBlogpost = pointsToBlog(frontmatter?.up);
    if (options.showReadingTime && isBlogpost) {
      const readingTime = originalChildren.at(-1);
      if (readingTime != null) children.push(readingTime);
    }
    return h("p", rendered.props, children);
  };
  component.css = base.css;
  return component;
};

export { DateContentMeta };
