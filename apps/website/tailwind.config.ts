import starlight from "@astrojs/starlight-tailwind";
import type { Config } from "tailwindcss";

export const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  plugins: [starlight],
};

export default config;
