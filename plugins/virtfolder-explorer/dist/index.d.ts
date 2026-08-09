import type { ExplorerOptions } from "@quartz-community/explorer";
import type { QuartzComponent } from "@quartz-community/types";

type VirtFolderExplorerOptions = Omit<Partial<ExplorerOptions>, "mapFn">;
declare function buildVirtFolderTree(node: Parameters<NonNullable<ExplorerOptions["mapFn"]>>[0]): Parameters<NonNullable<ExplorerOptions["mapFn"]>>[0];
declare const VirtFolderExplorer: (options?: VirtFolderExplorerOptions) => QuartzComponent;

export { VirtFolderExplorer, type VirtFolderExplorerOptions, buildVirtFolderTree };
