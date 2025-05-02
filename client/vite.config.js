import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import plainText from "vite-plugin-plain-text";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svgr from "vite-plugin-svelte-svgr";

export default defineConfig({
  plugins: [
    svelte({ preprocess: vitePreprocess() }),
    svgr(),
    plainText(["**/*.ftl"]),
    viteStaticCopy({
      targets: [{ src: "image/*", dest: "image" }],
    }),
  ],
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
