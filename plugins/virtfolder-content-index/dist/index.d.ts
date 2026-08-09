import type { ContentIndex } from "@quartz-community/content-index";
import type { QuartzEmitterPlugin } from "@quartz-community/types";

type ContentIndexOptions = Parameters<typeof ContentIndex>[0];
declare const VirtFolderContentIndex: QuartzEmitterPlugin<ContentIndexOptions>;

export { VirtFolderContentIndex };
