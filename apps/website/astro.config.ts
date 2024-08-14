import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://abi-js.github.io",
  base: "abi",
  compressHTML: true,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      favicon: "/favicon.svg",
      logo: {
        src: "./src/assets/abi.svg",
        alt: "Abi.js",
      },
      title: "Abi.js",
      social: {
        github: "https://github.com/abi-js",
        twitter: "https://x.com/abidotjs",
      },
      editLink: {
        baseUrl: "https://github.com/abi-js/abi/edit/trunk/apps/website/",
      },
      customCss: ["./src/design/global.css"],
      sidebar: [
        {
          label: "🏠 Home",
          link: "/",
        },
        {
          label: "📖 Guides",
          items: [
            {
              label: "Getting Started 🎉",
              link: "/guides/",
            },
          ],
        },
        {
          label: "📚 Reference",
          autogenerate: {
            directory: "reference",
          },
        },
      ],
    }),
  ],
});
