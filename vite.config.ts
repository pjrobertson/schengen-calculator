import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { execSync } from 'child_process'
import { VitePWA } from 'vite-plugin-pwa'

// Get git commit hash
const getGitHash = () => {
  try {
    const hash = execSync('git rev-parse --short HEAD').toString().trim();
    const isDirty = execSync('git status --porcelain').toString().trim().length > 0;
    return isDirty ? `${hash}-dirty` : hash;
  } catch {
    return 'dev';
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'emoji-data/**/*'],
      manifest: {
        name: 'Schengen Days Calculator',
        short_name: 'Schengen Calc',
        description: 'Free Schengen calculator to track your visa days and calculate remaining time in the Schengen Area',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Use "" for Capacitor builds, "/" for PWA
  base: process.env.CAPACITOR === 'true' ? '' : '/',
  define: {
    'import.meta.env.VITE_GIT_HASH': JSON.stringify(getGitHash()),
  },
})
