import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://abi.js.org",
	compressHTML: true,
	integrations: [
		starlight({
			favicon: "/favicon.svg",
			logo: {
				src: "./src/assets/abi.svg",
				alt: "Abi.js",
			},
			title: "Abi.js",
			social: [
				{
					label: "GitHub",
					href: "https://github.com/abi-js",
					icon: "github",
				},
				{
					label: "𝕏",
					href: "https://x.com/abidotjs",
					icon: "twitter",
				},
			],
			editLink: {
				baseUrl: "https://github.com/abi-js/abi/edit/trunk/www/docs/",
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
	vite: {
		plugins: [tailwindcss()],
	},
});
