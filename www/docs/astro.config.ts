import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://abi.js.org',
  compressHTML: true,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    starlight({
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/abi.svg',
        alt: 'Abi.js',
      },
      title: 'Abi.js',
      social: {
        github: 'https://github.com/abi-framework',
        twitter: 'https://x.com/abi_framework',
      },
      editLink: {
        baseUrl: 'https://github.com/abi-framework/abi/edit/trunk/www/docs/',
      },
      customCss: ['./src/design/global.css'],
      sidebar: [
        {
          label: '🏠 Home',
          link: '/',
        },
        {
          label: '📖 Guides',
          items: [
            {
              label: 'Getting Started 🎉',
              link: '/guides/',
            },
          ],
        },
        {
          label: '📚 Reference',
          autogenerate: {
            directory: 'reference',
          },
        },
      ],
    }),
  ],
});
