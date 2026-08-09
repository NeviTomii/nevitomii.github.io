import { Explorer } from "@quartz-community/explorer";

function buildVirtFolderTree(node) {
  if (node.slugSegment) return node;
  const normalize = (value) => {
    if (typeof value !== "string") return "";
    let result = value.trim().replace(/^!\[\[/, "[[");
    if (result.startsWith("[[") && result.endsWith("]]")) result = result.slice(2, -2);
    result = result.split("|")[0].split("#")[0];
    try {
      result = decodeURIComponent(result);
    } catch {
    }
    return result.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").replace(/\.md$/i, "").replace(/\/index$/i, "").trim().toLocaleLowerCase();
  };
  const basename = (value) => value.split("/").pop() ?? value;
  const firstParent = (value) => {
    const candidate = Array.isArray(value) ? value[0] : value;
    if (typeof candidate === "string") return normalize(candidate);
    if (candidate && typeof candidate === "object") return normalize(candidate.path ?? candidate.link ?? candidate.value);
    return "";
  };
  const files = [];
  const collect = (current) => {
    if (current.data) files.push(current);
    for (const child of current.children) collect(child);
  };
  for (const child of node.children) collect(child);
  const byName = /* @__PURE__ */ new Map();
  const register = (key, file) => {
    if (!key) return;
    const existing = byName.get(key);
    byName.set(key, existing && existing !== file ? null : file);
  };
  for (const file of files) {
    const data = file.data;
    const slug = normalize(data.slug);
    const filePath = normalize(data.filePath);
    const title = normalize(data.title);
    for (const key of [slug, basename(slug), filePath, basename(filePath), title]) register(key, file);
    file.children = [];
    file.isFolder = false;
  }
  const requestedParent = /* @__PURE__ */ new Map();
  for (const file of files) {
    const data = file.data;
    const target = firstParent(data.up);
    const parent = byName.get(target) ?? byName.get(basename(target));
    if (parent && parent !== file) requestedParent.set(file, parent);
  }
  const createsCycle = (file) => {
    const seen = /* @__PURE__ */ new Set([file]);
    let parent = requestedParent.get(file);
    while (parent) {
      if (seen.has(parent)) return true;
      seen.add(parent);
      parent = requestedParent.get(parent);
    }
    return false;
  };
  const roots = [];
  for (const file of files) {
    const parent = requestedParent.get(file);
    if (!parent || createsCycle(file)) {
      roots.push(file);
      continue;
    }
    parent.children.push(file);
    parent.isFolder = true;
  }
  for (const file of files) {
    if (!file.isFolder) continue;
    const data = file.data;
    Object.defineProperty(file, "slug", { configurable: true, enumerable: true, value: data.slug ?? "" });
  }
  node.children = roots;
  return node;
}

const VirtFolderExplorer = (options) => Explorer({
  ...options,
  folderClickBehavior: options?.folderClickBehavior ?? "link",
  mapFn: buildVirtFolderTree
});

export { VirtFolderExplorer, buildVirtFolderTree };
