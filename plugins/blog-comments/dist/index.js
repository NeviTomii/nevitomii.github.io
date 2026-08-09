import { Comments } from "@quartz-community/comments";

const pointsToBlog = (value) => {
  const values = Array.isArray(value) ? value : [value];
  return values.some((candidate) => {
    if (candidate && typeof candidate === "object") candidate = candidate.path ?? candidate.link ?? candidate.value;
    if (typeof candidate !== "string") return false;
    let parent = candidate.trim();
    if (parent.startsWith("[[") && parent.endsWith("]]")) parent = parent.slice(2, -2);
    parent = parent.split("|")[0].split("#")[0].trim();
    return parent.toLocaleLowerCase() === "blog";
  });
};

const BlogComments = (opts) => {
  if (!opts) throw new Error("BlogComments requires giscus options");
  const comments = Comments(opts);
  const component = (props) => {
    if (!pointsToBlog(props.fileData.frontmatter?.up)) return null;
    return comments(props);
  };
  component.css = comments.css;
  component.beforeDOMLoaded = comments.beforeDOMLoaded;
  component.afterDOMLoaded = comments.afterDOMLoaded;
  return component;
};

export { BlogComments };
