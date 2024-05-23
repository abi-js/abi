import starlight from "@astrojs/starlight";
import { defineConfig, passthroughImageService } from "astro/config";
import deno from '@astrojs/deno';

// https://astro.build/config
export default defineConfig({
  site: "https://abi.deno.dev",
  srcDir: "./src",
  outDir: "./dist/build",
  publicDir: "./public",
  build: {
    client: "./dist/build/client",
    server: "./dist/build/server",
  },
  compressHTML: true,
  output: "server",
  image: {
    service: passthroughImageService(),
  },
  adapter: deno({
    port: 8000,
    start: false,
  }),
  integrations: [
    starlight({
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/abi.svg",
        alt: "Abi",
      },
      title: "Abi",
      social: {
        github: "https://github.com/abi-sh",
      },
      editLink: {
        baseUrl: "https://github.com/abi-sh/abi.deno.dev/edit/main/",
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
