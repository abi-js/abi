import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
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
        twitter: "https://twitter.com/abidotjs",
      },
      editLink: {
        baseUrl:
          "https://github.com/abi-js/abi.js/edit/trunk/src/content/docs/",
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
