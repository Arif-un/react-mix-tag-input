// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  base:'/react-mix-tag-input/',
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  })]
});