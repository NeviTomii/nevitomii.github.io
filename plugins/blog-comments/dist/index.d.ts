import type { CommentsOptions } from "@quartz-community/comments";
import type { QuartzComponentConstructor } from "@quartz-community/types";

declare const BlogComments: QuartzComponentConstructor<CommentsOptions>;
type BlogCommentsOptions = CommentsOptions;

export { BlogComments, type BlogCommentsOptions };
