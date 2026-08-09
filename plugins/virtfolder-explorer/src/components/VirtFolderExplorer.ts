import { Explorer, type ExplorerOptions } from "@quartz-community/explorer"
import type { QuartzComponentConstructor } from "@quartz-community/types"

type FileTrieNode = Parameters<NonNullable<ExplorerOptions["mapFn"]>>[0]

type VirtFolderData = Record<string, unknown> & {
  slug?: string
  filePath?: string
  title?: string
  up?: unknown
}

export type VirtFolderExplorerOptions = Omit<Partial<ExplorerOptions>, "mapFn">

/**
 * This function is serialized by the upstream Explorer and evaluated in the browser.
 * Keep every helper inside the function so it has no closure dependencies.
 */
export function buildVirtFolderTree(node: FileTrieNode): FileTrieNode {
  if (node.slugSegment) return node

  const normalize = (value: unknown): string => {
    if (typeof value !== "string") return ""
    let result = value.trim().replace(/^!\[\[/, "[[")
    if (result.startsWith("[[") && result.endsWith("]]")) {
      result = result.slice(2, -2)
    }
    result = result.split("|")[0].split("#")[0]
    try {
      result = decodeURIComponent(result)
    } catch {
      // Keep malformed percent-escapes unchanged.
    }
    return result
      .replace(/\\/g, "/")
      .replace(/^\/+|\/+$/g, "")
      .replace(/\.md$/i, "")
      .replace(/\/index$/i, "")
      .trim()
      .toLocaleLowerCase()
  }

  const basename = (value: string): string => value.split("/").pop() ?? value
  const firstParent = (value: unknown): string => {
    const candidate = Array.isArray(value) ? value[0] : value
    if (typeof candidate === "string") return normalize(candidate)
    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>
      return normalize(record.path ?? record.link ?? record.value)
    }
    return ""
  }

  const files: FileTrieNode[] = []
  const collect = (current: FileTrieNode): void => {
    if (current.data) files.push(current)
    for (const child of current.children) collect(child)
  }
  for (const child of node.children) collect(child)

  const byName = new Map<string, FileTrieNode | null>()
  const register = (key: string, file: FileTrieNode): void => {
    if (!key) return
    const existing = byName.get(key)
    byName.set(key, existing && existing !== file ? null : file)
  }

  if (node.data) {
    const data = node.data as VirtFolderData
    const slug = normalize(data.slug)
    const filePath = normalize(data.filePath)
    const title = normalize(data.title)
    for (const key of [slug, basename(slug), filePath, basename(filePath), title]) {
      register(key, node)
    }
  }

  for (const file of files) {
    const data = file.data as VirtFolderData
    const slug = normalize(data.slug)
    const filePath = normalize(data.filePath)
    const title = normalize(data.title)
    for (const key of [slug, basename(slug), filePath, basename(filePath), title]) {
      register(key, file)
    }
    file.children = []
    file.isFolder = false
  }

  const requestedParent = new Map<FileTrieNode, FileTrieNode>()
  for (const file of files) {
    const data = file.data as VirtFolderData
    const target = firstParent(data.up)
    const parent = byName.get(target) ?? byName.get(basename(target))
    if (parent && parent !== file) requestedParent.set(file, parent)
  }

  const createsCycle = (file: FileTrieNode): boolean => {
    const seen = new Set<FileTrieNode>([file])
    let parent = requestedParent.get(file)
    while (parent) {
      if (seen.has(parent)) return true
      seen.add(parent)
      parent = requestedParent.get(parent)
    }
    return false
  }

  const roots: FileTrieNode[] = []
  for (const file of files) {
    const parent = requestedParent.get(file)
    if (!parent || createsCycle(file)) {
      roots.push(file)
      continue
    }
    if (parent === node) {
      roots.push(file)
      continue
    }
    parent.children.push(file)
    parent.isFolder = true
  }

  for (const file of files) {
    if (!file.isFolder) continue
    const data = file.data as VirtFolderData
    Object.defineProperty(file, "slug", {
      configurable: true,
      enumerable: true,
      value: data.slug ?? "",
    })
  }

  node.children = roots
  return node
}

const revealActiveBranch = `
(() => {
  if (window.__virtFolderRevealInstalled) return
  window.__virtFolderRevealInstalled = true

  const reveal = () => {
    document.querySelectorAll(".explorer a.active").forEach((active) => {
      let item = active.closest("li")
      while (item) {
        const outer = item.parentElement?.closest(".folder-outer")
        if (!outer) break
        outer.classList.add("open")
        item = outer.closest("li")
      }
    })
  }

  new MutationObserver(reveal).observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
  document.addEventListener("nav", reveal)
  document.addEventListener("render", reveal)
  reveal()
})()
`

export const VirtFolderExplorer = ((options?: VirtFolderExplorerOptions) => {
  const component = Explorer({
    ...options,
    folderClickBehavior: options?.folderClickBehavior ?? "link",
    mapFn: buildVirtFolderTree,
  })
  component.afterDOMLoaded = [component.afterDOMLoaded, revealActiveBranch]
    .filter(Boolean)
    .join("\n")
  return component
}) satisfies QuartzComponentConstructor
