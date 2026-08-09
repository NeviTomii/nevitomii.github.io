import type { QuartzComponentConstructor } from "@quartz-community/types";

interface DateContentMetaOptions {
  showReadingTime: boolean;
  showComma: boolean;
}

declare const DateContentMeta: QuartzComponentConstructor<DateContentMetaOptions>;

export { DateContentMeta, type DateContentMetaOptions };
