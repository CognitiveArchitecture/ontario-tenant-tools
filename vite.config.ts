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
      // The PNG and SVG icons match the precache glob below; the .ico does not
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Ontario Tenant Tools',
        short_name: 'TenantTools',
        description: 'Free tools for Ontario tenants facing eviction',
        theme_color: '#16171a',
        background_color: '#16171a',
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
        // The not-found picture is 218 KB, far more than everything else the
        // service worker stores up front. Leave it out of the precache and
        // cache it the first time the not-found view shows it instead.
        globIgnores: ['404-cliff.png'],
        runtimeCaching: [
          {
            urlPattern: /\/404-cliff\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'not-found-image',
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
