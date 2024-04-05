import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/velox.svg",
        alt: "Velox",
      },
      title: "Velox",
      social: {
        github: "https://github.com/velox-sh",
      },
      editLink: {
        baseUrl:
          "https://github.com/velox-sh/velox-sh.github.io/edit/trunk/src/content/docs/",
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
