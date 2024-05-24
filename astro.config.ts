import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import deno from '@astrojs/deno';

// https://astro.build/config
export default defineConfig({
  site: "https://abi.js.org",
  srcDir: "./src",
  outDir: "./out",
  publicDir: "./public",
  build: {
    client: "./out/client",
    server: "./out/server",
  },
  compressHTML: true,
  integrations: [
    starlight({
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/abi.svg",
        alt: "Abi.js",
      },
      title: "Abi.js",
      social: {
        github: "https://github.com/abi-js",
      },
      editLink: {
        baseUrl: "https://github.com/abi-js/abi.js.org/edit/main/",
      },
      sidebar: [
        {
          label: "Home",
          link: "/",
        },
        {
          label: "Getting started",
          items: [{ label: "Quickstart", link: "/start/" }],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
