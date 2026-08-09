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

test("places Aurora under Hobbies then Reading", () => {
  const hobbies = file("Hobbies", "notes/hobbies")
  const reading = file("Reading", "reading", ["[[Hobbies]]"])
  const aurora = file("Aurora", "aurora", "[[Reading]]")
  const tree = buildVirtFolderTree(root(reading, hobbies, aurora))

  assert.deepEqual(tree.children.map((node) => node.data.title), ["Hobbies"])
  assert.deepEqual(hobbies.children.map((node) => node.data.title), ["Reading"])
  assert.deepEqual(reading.children.map((node) => node.data.title), ["Aurora"])
})

test("keeps the real URL when a note becomes a virtual folder", () => {
  const parent = file("Parent", "real/location/parent")
  const child = file("Child", "elsewhere/child", "[[Parent]]")

  buildVirtFolderTree(root(parent, child))

  assert.equal(parent.isFolder, true)
  assert.equal(parent.slug, "real/location/parent")
  assert.equal(child.data.slug, "elsewhere/child")
})

test("places Blog structure alone in a synthetic Homepage folder", () => {
  const blogStructure = file("Blog structure", "blog-structure", "[[Index]]")
  const otherRootFile = file("Other", "other", "[[Index]]")

  const tree = buildVirtFolderTree(root(blogStructure, otherRootFile))
  const homepage = tree.children.find((node) => node.displayName === "Homepage")

  assert.ok(homepage)
  assert.equal(homepage.slug, "/")
  assert.deepEqual(homepage.children.map((node) => node.data.title), ["Blog structure"])
  assert.ok(tree.children.includes(otherRootFile))
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
