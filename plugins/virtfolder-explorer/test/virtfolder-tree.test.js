import assert from "node:assert/strict"
import test from "node:test"
import { buildVirtFolderTree } from "../dist/index.js"

function file(title, slug, up) {
  return {
    slugSegment: slug.split("/").at(-1),
    slugSegments: slug.split("/"),
    isFolder: false,
    children: [],
    data: {
      title,
      slug,
      filePath: `${title}.md`,
      ...(up === undefined ? {} : { up }),
    },
  }
}

function root(...children) {
  return {
    slugSegment: "",
    slugSegments: [],
    isFolder: true,
    children,
    data: null,
  }
}

test("builds recursive hierarchy from wikilink up properties", () => {
  const hobbies = file("Hobbies", "notes/hobbies")
  const boardGames = file("Board games", "board-games", ["[[Hobbies]]"])
  const twilightImperium = file(
    "Twilight Imperium",
    "games/twilight-imperium",
    "[[Board games|Games]]",
  )
  const tree = buildVirtFolderTree(root(boardGames, hobbies, twilightImperium))

  assert.deepEqual(tree.children.map((node) => node.data.title), ["Hobbies"])
  assert.deepEqual(hobbies.children.map((node) => node.data.title), ["Board games"])
  assert.deepEqual(boardGames.children.map((node) => node.data.title), ["Twilight Imperium"])
})

test("keeps the real URL when a note becomes a virtual folder", () => {
  const parent = file("Parent", "real/location/parent")
  const child = file("Child", "elsewhere/child", "[[Parent]]")

  buildVirtFolderTree(root(parent, child))

  assert.equal(parent.isFolder, true)
  assert.equal(parent.slug, "real/location/parent")
  assert.equal(child.data.slug, "elsewhere/child")
})

test("treats Index as the virtual root parent", () => {
  const blogStructure = file("Blog structure", "blog-structure", "[[Index]]")
  const treeRoot = root(blogStructure)
  treeRoot.data = {
    title: "Index",
    slug: "index",
    filePath: "Index.md",
  }

  const tree = buildVirtFolderTree(treeRoot)

  assert.deepEqual(tree.children.map((node) => node.data.title), ["Blog structure"])
})

test("leaves cyclic and missing parent relationships at the root", () => {
  const a = file("A", "a", "[[B]]")
  const b = file("B", "b", "[[A]]")
  const orphan = file("Orphan", "orphan", "[[Missing]]")
  const tree = buildVirtFolderTree(root(a, b, orphan))

  assert.deepEqual(
    tree.children.map((node) => node.data.title).sort(),
    ["A", "B", "Orphan"],
  )
})
