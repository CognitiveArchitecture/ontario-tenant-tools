import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'packages/core'),
      '@calculator': resolve(__dirname, 'packages/calculator'),
      '@glossary': resolve(__dirname, 'packages/glossary'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Ontario Tenant Tools',
        short_name: 'TenantTools',
        description: 'Free tools for Ontario tenants facing eviction',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
      },
    }),
  ],
  build: {
    target: 'es2020',
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
