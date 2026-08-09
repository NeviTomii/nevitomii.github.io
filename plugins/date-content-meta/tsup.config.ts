import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/components/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["@quartz-community/content-meta", "preact"],
})
