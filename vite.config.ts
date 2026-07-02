import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        workbox: {
          // Force the new SW to activate immediately (skip waiting)
          skipWaiting: true,
          clientsClaim: true,
          // Don't precache HTML — always fetch fresh from network
          navigateFallback: undefined,
          // Only precache JS/CSS assets (they have unique hashes in filenames)
          globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
          // Runtime caching: network-first for HTML pages
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/programme-week-end-pionnier-berlin-fr\.netlify\.app\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60, // 1 hour
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Week-end Pionnier',
          short_name: 'Pionnier',
          description: 'L\'application officielle pour votre week-end pionnier.',
          theme_color: '#fafaf9',
          background_color: '#fafaf9',
          display: 'standalone',
          icons: [
            {
              src: 'favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
